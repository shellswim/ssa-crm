const moment = require('moment');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const { raw } = require('mysql');

exports.tuitioncalc = async function(options) {

    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////

    options = this.parse(options);
    let fid = options.familyid;
    let mtp = options.monthtoprocess;
    let stp = options.sessiontoprocess;
    let bc = dbClientFlat(await db.raw(`SELECT bc.* FROM billingCycles bc JOIN (SELECT * FROM settings WHERE name = 'billing_cycle') AS setting ON bc.id = setting.value`)).id;
    let bc_type = bc == 2 || bc == 3 ? 'month' : 'session';
    let mtp_dr = {"start": moment(mtp).startOf('month'), "end": moment(mtp).endOf('month')};
    let mtp_n = moment(mtp).month();

    /////Enrolment Discount Types - Bulk means classes will be discounted from the settings at the total weekly enrolments. Perenrol works down the discount settings and attached discounts depending on the class number for that week.
    let enr_disc_enable = dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name = 'endiscount_enable'`)).value == 1 ? true : false;
    if(enr_disc_enable) {
        let enr_disc_type = dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name = 'endiscount_bulk'`)).value == 1 ? 'bulk' : 'perenrol';
    }
    
    ///// Date Range Setup
    let charge_ahead = Boolean(Number(dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name = 'billing_charge_ahead'`)).value));
    let dr_current, dr_next;
    if(bc_type === 'session') { ///// If sessions enabled, process dates. Charge ahead not currently available for sessions/terms.
        dateRange(stp, false, bc_type);
    } else {
        dr_current = await dateRange(mtp_dr, 'month');
        if(charge_ahead) {
            dr_next = await dateRange({"start": mtp_dr.start.add(1,'month'), "end": mtp_dr.end.add(1,'month').endOf('month')}, 'month');
        }
    }

    ///// Discount Settings
    let discSettings = {
        'enroldiscounts': {
            'enabled': dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name ='endiscount_enable'`)).value,
            'type': dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name ='endiscount_type'`)).value
        },
        'familydiscounts': {
            'enabled': dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name ='fdiscount_enable'`)).value,
            'type': dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name ='fdiscount_type'`)).value,
            'lowestfirst': dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name ='fdiscount_lowest_total_fees_first'`)).value
        }
    }

    ///// Students Process
    let students = await getStudents(fid);
    async function getStudents(fid) {
        let arr = {};
        let s = dbClient(await db.raw(`SELECT * FROM students WHERE family = ${fid}`));
        for(let i=0;i<s.length;i++) {
            arr[s[i].id] = s[i];
        }
        return arr;
    }
    /// Get Enrolments
    // let skeys = Object.keys(students);
    for(let student in students) {
        students[student].enrolments = await getEnrols(student);
        let enrolments = students[student].enrolments;
        let rawcharge = 0;
        for(let dates in enrolments) {
            rawcharge += enrolments[dates].rawcharge || 0;
        }
        students[student].rawcharge = rawcharge;
    };
    // for(let i=0;i<students.length;i++) {
    //     let st = students[i];
    //     st['enrolments'] = await getEnrols(st.id);
    // }
    async function getEnrols(sid) {
        let enrols = {};
        for(let i=0; i<dr_current.weekarr.length;i++) {
            let cd = dr_current.weekarr[i];
            enrols[cd.startofweek] = {};
            let enrolments = dbClient(await db.raw(`
            SELECT e.*, c.day, c.classType AS classType, ct.baseRate, ct.shortName, '${cd.startofweek}' AS sow, '${cd.endofweek}' AS eow, '${sid}' AS sid
            FROM enrolments e 
                INNER JOIN classes c ON e.classID = c.id 
                INNER JOIN classTypes ct ON c.classType = ct.id
                WHERE e.student = ${sid}
                AND e.isValid = 1 AND 
                e.enrolmentType = 1 
                AND (e.dropDate IS NULL 
                    OR e.dropDate >= '${cd.startofweek}'
                    OR e.dropDate BETWEEN '${cd.startofweek}' AND '${cd.endofweek}') 
                AND (e.startDate <= '${cd.endofweek}' OR e.startDate BETWEEN '${cd.startofweek}' AND '${cd.endofweek}')
                AND c.day IN(${cd.dayint})
                `)) || null;

            // Get pricing - Raw & Discounted
            if(enrolments.length > 0) {
                let rawprice = await pricingCalc(enrolments);
                // for(let i=0;i<enrolments.length;i++) {
                //     pricecalc = await pricingCalc(enrolments[i],enrolments.length);
                //     rawprice = rawprice += pricecalc.enrolprice;
                // }
                enrols[cd.startofweek]['rawcharge'] = rawprice;
                enrols[cd.startofweek]['pricecalc'] = pricecalc;
            }
            for(let i=0;i<enrolments.length;i++) {
                let id = enrolments[i].id;
                enrols[cd.startofweek][id] = enrolments[i];
            }
        }
        return enrols;
    }

    ///// Billing Calculations
    /* e = enrolment, ec = enrolment count */
    async function pricingCalc(e) {
        // return e.classType;
        let price = rawPriceCalc(e);
        if(discSettings.enroldiscounts.enabled == 1) {
            let discAmt;
            let p = 0;
            if(discSettings.enroldiscounts.type == 'bulk') {
                discAmt = dbClientFlat(await db.raw(`SELECT * FROM perStudentDiscounts WHERE classType = '${e.classType}' AND enrolmentCount = '${e.length}' LIMIT 1`,[]));
            } else {
                discAmt = dbClient(await db.raw(`SELECT * FROM perStudentDiscounts WHERE classType = '${e.classType}'`,[]));
            }
            if(discAmt.discountType === 1) { // Discount type 1 == Percentage
                if(discSettings.enroldiscounts.type == 'bulk') {
                    for(let i=0;i<e.length;i++) {
                        p += price.enrolprice - (price.enrolprice * (discAmt.discountAmount / 100));
                    }
                } else {
                    for(let i=0;i<e.length;i++) {
                        p += price.enrolprice - (price.enrolprice * (discAmt[i].discountAmount / 100))
                    }
                }
            } else {

            }
        }
        return p;
    }
    // Raw pricing
    function rawPriceCalc(e) {
        let calcreturn = {
            'enrolprice': 0,
            'priceoverride': false,
            'priceoverridetype': null
        }
        if(e.priceOverride === 1) {
            if(e.priceOverrideType === 'flat') {
                calcreturn.priceoverridetype = 'flat'
            } else {
                calcreturn.priceoverridetype = 'perclass'
            }
            calcreturn.priceoverride = true;
            calcreturn.enrolprice = e.priceOverrideValue;
        } else {
            calcreturn.enrolprice = e.baseRate;
        }
        return calcreturn;
    }

    ///// Create Date Ranges - Billing breaks down enrolments per week.
    async function dateRange(dr,type) {
        if(type === 'month') {
            let start = moment(dr.start).startOf('week');
            let end = moment(dr.start).endOf('week');
            let curr = moment(dr.start);
            let range = {
                'arr': [0,0,0,0,0,0,0],
                'weekarr': []
            }
            // Create Month Ranges
            while(curr.isSameOrBefore(moment(dr.end))) {
                range.arr[curr.day()] += 1;
                curr.add(1, 'd');
            }
            while(start.isSameOrBefore(moment(dr.end))) {
                let sow = start.month() != moment(dr.start).month() ? moment(dr.start).format('YYYY-MM-DD') : start.format('YYYY-MM-DD');
                let eow = end.month() != moment(dr.end).month() ? moment(dr.end).format('YYYY-MM-DD') : end.format('YYYY-MM-DD');
                let a = moment(sow).clone(), dayint = [];
                while(a.isSameOrBefore(eow)) {
                    dayint.push(a.day() + 1);
                    a.add(1,'d');
                }
                range.weekarr.push({'startofweek': sow, 'endofweek': eow, 'dayint': dayint});
                end.add(1, 'w');
                start.add(1, 'w');
            }
            return range;
        } else {

        }
    }


    // ///// Setup Billing Cycle
    // let bcycle = dbClientFlat(await db.raw(`SELECT bc.* FROM billingCycles bc JOIN (SELECT * FROM settings WHERE name = 'billing_cycle') AS setting ON bc.id = setting.value`)).value;
    // let bcycle_ahead = Boolean(dbClientFlat(Number(await db.raw("SELECT value FROM settings WHERE name = 'billing_cycle_charge_ahead'"))).value);

    // // Start 'Monthly' & 'Force 4 Week Month' billing cycle setup
    // if(bcycle == 2 || bcycle == 3) {
    //     let tmstart = moment().startOf('month');
    //     let tmend = moment().endOf('month');
    //     if(bcycle_ahead) {
    //         let tmstart_ahead = moment().add(1, 'month').startOf('month');
    //         let tmend_ahead = moment().add(1, 'month').endOf('month');
    //     }
    // }

    // // Get class types and their prices
    // let class_types = dbClient(await db.raw(`SELECT * FROM classTypes`));

    // // Get students
    // let students = dbClient(await db.raw(`SELECT * from students WHERE family = ${fid}`));

    // let std_enrol_arr = {};

    // // Loop through students & get enrolments
    // for(let i=0;i<students.length;i++) {
    //     std_enrol_arr[students[i].id] = dbClient(await db.raw(`SELECT * FROM enrolments WHERE student = ${students[i].id} AND isValid = 1`));
    // }


    ///// DB Query Processor
    function dbClientFlat(v) {
        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            return v[0][0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            return v = v.rows;
        }
    }
    function dbClient(v) {
        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            return v[0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            return v = v.rows;
        }
    }

    let feesobject = {
        "students": students,
        "familyid": fid,
        "dates": {
            "current": dr_current,
            "next": dr_next
        },
        'discount_settings': discSettings
    }

    return feesobject;
}