//const  = require('moment');
const moment = require('moment-timezone');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const { evaluate, sum, chain: mathchain, round } = require('mathjs');
const {
    raw
} = require('mysql');
const e = require('express');

exports.tuitioncalc = async function (options) {

    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////
    //////////// Utilities ////////////
    function isObjectEmpty(value) {
        return (
            Object.prototype.toString.call(value) === '[object Object]' &&
            JSON.stringify(value) === '{}'
        );
    }
    const arrayToObj = (array, keyfield) =>
        array.reduce((obj, item) => {
            obj[item[keyfield]] = item;
            return obj;
        }, {});

    function moneyround(x, d) {
        return Number(parseFloat(x).toFixed(d));
    }
    /////////// End utilities ///////////

    options = this.parse(options);
    // Get timezone from DB
    let tz = dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name = 'timezone'`));
    let fid = options.familyid;
    let mtp = moment.utc(options.monthtoprocess).tz(tz.value);
    let som = mtp.clone().startOf('month').format('YYYY-MM-DD');
    let findexistingcharge = dbClient(await db.raw(`SELECT * FROM charges_family WHERE family_uuid = '${fid}' AND chargeFor_monthly = '${som}'`)); 
    let hascharge_monthly = findexistingcharge.length > 0 ? true : false;
    let mtp_show = mtp.clone().format('YYYY-MM-DD ha z')
    let stp = options.sessiontoprocess;
    let bc = dbClientFlat(await db.raw(`SELECT bc.* FROM billingCycles bc JOIN (SELECT * FROM settings WHERE name = 'billing_cycle') AS setting ON bc.id = setting.value`)).id;
    let bc_type = bc == 2 || bc == 3 ? 'month' : 'session';
    let mtp_dr = {
        "start": mtp.clone().startOf('month'),
        "end": mtp.clone().endOf('month')
    };
    let mtp_next = moment(mtp).month();

    /////Enrolment Discount Types - Bulk means classes will be discounted from the settings at the total weekly enrolments. Perenrol works down the discount settings and attached discounts depending on the class number for that week.
    let enr_disc_enable = dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name = 'endiscount_enable'`)).value == 1 ? true : false;
    if (enr_disc_enable) {
        let enr_disc_type = dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name = 'endiscount_bulk'`)).value == 1 ? 'bulk' : 'perenrol';
    }

    ///// Date Range Setup
    let charge_ahead = Boolean(Number(dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name = 'billing_charge_ahead'`)).value));
    let dr_current, dr_next;
    if (bc_type === 'session') { ///// If sessions enabled, process dates. Charge ahead not currently available for sessions/terms.
        dateRange(stp, false, bc_type);
    } else {
        dr_current = await dateRange(mtp_dr, 'month');
        if (charge_ahead) {
            dr_next = await dateRange({
                "start": mtp_dr.start.add(1, 'month'),
                "end": mtp_dr.end.add(1, 'month').endOf('month')
            }, 'month');
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
            'lowestfirst': dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name ='fdiscount_lowest_total_fees_first'`)).value,
            'discountmatrix': arrayToObj(dbClient(await db.raw(`SELECT * FROM perFamilyDiscounts`)), "studentCount")
        }
    }

    ///// Student and family processing
    let studentsprocessed = await studentsProcess(fid);
    let familyprocessed = await familyProcess(studentsprocessed);


    /*/*/
    /*/*/
    /*/*/ // FUNCTIONS START

    ///// Students Process
    async function studentsProcess(fid) {
        let students = await getStudents(fid);
        async function getStudents(fid) {
            let arr = {};
            let s = dbClient(await db.raw(`SELECT * FROM students WHERE family = '${fid}'`));
            for (let i = 0; i < s.length; i++) {
                arr[s[i].uuid] = s[i];
            }
            return arr;
        }
        /// Get Enrolments with Enrolment Discounts if applicable
        for (let student in students) {
            let s = students[student];
            s.enrolments = await getEnrols(student);
            let enrolments = s.enrolments;
            let netcharge = [],
                grosscharge = [],
                discounttotal = [];
            for (let week in enrolments) {
                if (isObjectEmpty(enrolments[week])) {
                    delete enrolments[week];
                } else {
                    let weeknet = [],
                        weekgross = [],
                        weekdiscount = [];
                    let enrols = enrolments[week];
                    for (let enrol in enrols) {
                        weeknet.push(enrols[enrol].pricing.enNetRate);
                        weekgross.push(enrols[enrol].pricing.baseRate);
                        weekdiscount.push(enrols[enrol].pricing.endisc);
                    }
                    netcharge.push(round(sum(weeknet),2));
                    grosscharge.push(round(sum(weekgross),2));
                    discounttotal.push(round(sum(weekdiscount),2));
                }
            }
            students[student].tuition = {
                'student': student,
                'netenrolcharge': round(sum(netcharge),2),
                'grossenrolcharge': round(sum(grosscharge),2),
                'totaldiscounts': round(sum(discounttotal),2)
            };
        };
        return students;
    }

    // Process students into weeks of date range. This will enable family discount totalling.
    async function familyProcess(students) {
        let enrolarray = {};
        let enrolfinal = {};
        let finalcharges;
        let remaining = removeInactiveStudents();
        let familytotal = [];
        let matrix = discSettings.familydiscounts.discountmatrix;

        function removeInactiveStudents() {
            for (let student in students) {
                let s = students[student];
                if (isObjectEmpty(s.enrolments)) {
                    delete students[student];
                }
            }
            return students;
        }
        // Per student family discounts
        if (discSettings.familydiscounts.type == 'perstudent') {
            let dates = dr_current.weekarr;
            // Create Enrolarray
            for (let i = 0; i < dates.length; i++) {
                enrolarray[dates[i].startofweek] = [];
                for (let student in remaining) {
                    let s = remaining[student];
                    if (s.enrolments.hasOwnProperty(dates[i].startofweek)) {
                        let enrols = s.enrolments[dates[i].startofweek];
                        let grossweekprice = [];
                        for (single in enrols) {
                            grossweekprice.push(enrols[single].pricing.enNetRate);
                        }
                        enrolarray[dates[i].startofweek].push({
                            'student': s.id,
                            'studentname': s.firstName + ' ' + s.lastName,
                            'enrolments': s.enrolments[dates[i].startofweek],
                            'grossweekprice': round(sum(grossweekprice),2)
                        });
                        // enrolfinal[s.id] = remaining[student];
                    }
                }
            }
            for (let date in enrolarray) {
                let week = enrolarray[date];
                if (week.length === 0) {
                    delete enrolarray[date];
                    continue;
                }
                week = _.sortBy(week, function (o) {
                    return discSettings.familydiscounts.lowestfirst == 1 ? -o.grossweekprice : o.grossweekprice;
                });
                for (let i = 0; i < week.length; i++) {
                    let order = i + 1;
                    let w = week[i];
                    w.order = order; // Student discount order
                    w.netweekprice = round(sum(w.grossweekprice - (w.grossweekprice * (matrix[order].discountAmount / 100))),2); // Total price for week after discount

                    // Family discounts
                    for(enrol in w.enrolments) {
                        let e = w.enrolments[enrol].pricing;
                        e.familydiscounttotal = round(sum(e.enNetRate * (matrix[order].discountAmount / 100)),4);
                        e.familydiscountrate = matrix[order].discountAmount + `${matrix[order].discountType == 1 ? '%' : ' Flat Rate'}`;
                        e.familydiscountdesc = matrix[order].description || '-';
                        e.enrolGrandTotal = round(sum(e.enNetRate - e.familydiscounttotal),2);
                    }
                    w.familydiscounttotal = round(sum(w.grossweekprice * (matrix[order].discountAmount / 100)),4); // Total discount applied.
                    w.familydiscountrate = matrix[w.order].discountAmount + `${matrix[order].discountType == 1 ? '%' : ' Flat Rate'}`; // Discount rate applied.
                    familytotal.push(w.netweekprice);
                }
            }
            finalcharges = formatFinalCharges(enrolarray);

            // Bulk family discounts  
        } else {

        }

        function formatFinalCharges(arr) {
            var final = {
                    'chargefor': dr_current.descriptor,
                    'monthtocharge': mtp.format('YYYY-MM-DD'),
                    'monthlychargeexists': {
                        'exists': hascharge_monthly,
                        'charge_uuid': findexistingcharge.length >= 2 ? 'Error: Multiple charges for this period exist. Error must be corrected before proceeding.' : hascharge_monthly ? findexistingcharge[0].uuid : null,
                        'status': findexistingcharge.length > 1 ? 409 : 200,
                        'created': findexistingcharge[0] ? findexistingcharge[0].created : null 
                    },
                    'monthlycharge': som,
                    'weeks': {

                    },
                    'enrolments': [],
                    'totals': {
                        'baseRate': [],
                        'enrolsnet': [],
                        'enrolsdisctotal': [],
                        'familydisctotal': [],
                        'disctotal': [],
                        'familygrandtotal': []
                    }
            };

            let t = final.totals; // Tap into totals branch of final.

            for(let weeks in arr) {
                let week = arr[weeks]; // Current week looped e.g. 2021-12-05.
                let w = final.weeks; // Tap into weeks branch of final.
                w[weeks] = {}; // Create week/date key.
                let fweek = w[weeks];
                for(let i=0;i<week.length;i++) {
                    let st = week[i];
                    let weektotals = {
                        'baseRate': [],
                        'enNetRate': [],
                        'en_disc_total': 0,
                        'familydisctotal': []
                    }
                    for(enrols in st.enrolments) {
                        let en = st.enrolments[enrols];
                        weektotals.baseRate.push(en.pricing.baseRate);
                        weektotals.enNetRate.push(en.pricing.enNetRate);
                        weektotals.familydisctotal.push(en.pricing.familydiscounttotal);
                        final.enrolments.push(en);
                    }
                    weektotals.baseRate = mathchain(weektotals.baseRate).sum().round(2).done();
                    weektotals.enNetRate = mathchain(weektotals.enNetRate).sum().round(2).done();
                    weektotals.familydisctotal = mathchain(weektotals.familydisctotal).sum().round(2).done();
                    weektotals.en_disc_total = mathchain(weektotals.baseRate - weektotals.enNetRate).sum().round(2).done();

                    // Start adding totals to period totals array
                    t.baseRate.push(weektotals.baseRate);
                    t.enrolsnet.push(weektotals.enNetRate);
                    t.enrolsdisctotal.push(weektotals.en_disc_total);
                    t.familydisctotal.push(weektotals.familydisctotal);
                    
                    
                    fweek[st.student] = {
                        'enrolments': st.enrolments,
                        'weektotals': weektotals,
                        'studentname': st.studentname,
                        'startofweek': weeks
                    };
                }
                
                
                // Student total breakdowns
            }
            
            // Process period totals array
            t.baseRate = mathchain(t.baseRate).sum().round(2).done();
            t.enrolsnet = mathchain(t.enrolsnet).sum().round(2).done();
            t.enrolsdisctotal = round(sum(t.baseRate - t.enrolsnet),2);
            t.familydisctotal = mathchain(t.familydisctotal).sum().round(2).done();
            t.disctotal = round(sum(t.familydisctotal + t.enrolsdisctotal),2);
            t.familygrandtotal = mathchain(t.enrolsnet - t.familydisctotal).sum().round(2).done();

            return final;

        }

        let processed = {
            // 'enrolarray': enrolarray,
            // 'enrolsfinal': enrolfinal,
            'finalcharges': finalcharges,
            // 'chargefor': dr_current.descriptor,
            // 'familychargetotal': familytotal,
            // 'remaining': remaining,
            // 'familychargetotalreduced': round(sum(familytotal),2)
        }

        return finalcharges;
    }

    async function getEnrols(sid) {
        let enrols = {};
        let enrolcount = {};
        for (let i = 0; i < dr_current.weekarr.length; i++) {
            let cd = dr_current.weekarr[i];
            enrols[cd.startofweek] = {};
            let enrolments = dbClient(await db.raw(`
            SELECT e.*, c.day AS classday, c.classType AS classType, c.classtype_uuid, ct.baseRate, ct.shortName, s.firstName, s.lastName, c.instructor_uuid, c.classlevel_uuid
            FROM enrolments e 
                LEFT JOIN students s ON e.student_uuid = s.uuid
                LEFT JOIN classes c ON e.class_uuid = c.uuid 
                LEFT JOIN classTypes ct ON c.classtype_uuid = ct.uuid
                WHERE e.student_uuid = '${sid}' AND
                e.enrolmentType = 1 
                AND (e.dropDate IS NULL 
                    OR e.dropDate >= '${cd.startofweek}'
                    OR e.dropDate BETWEEN '${cd.startofweek}' AND '${cd.endofweek}') 
                AND (e.startDate <= '${cd.endofweek}' OR e.startDate BETWEEN '${cd.startofweek}' AND '${cd.endofweek}')
                AND c.day IN(${cd.dayint})
                ORDER BY c.day ASC, c.startTimeDecimal ASC
                `)) || null;
            // Get pricing - Raw & Discounted - Add class meeting date.
            if (enrolments.length > 0) {
                
                for (let i = 0; i < enrolments.length; i++) {
                    let eid = enrolments[i].id;
                    // Count occurances of each enrolment per month & discount on "Force 4 Week Month"
                    if(bc == 3) {
                        if(enrolcount.hasOwnProperty(eid)) {
                            enrolcount[eid] += 1
                        } else {
                            enrolcount[eid] = 1
                        }
                    }
                    pricecalc = await pricingCalc(enrolments[i], (i + 1), enrolments.length);
                    // rawprice = rawprice += pricecalc.netamt;
                    enrolments[i]['pricing'] = {
                        'enNetRate': (enrolcount[eid] >=5 ? 0 : pricecalc.netamt) || 0,
                        'endisc': (enrolcount[eid] >=5 ? pricecalc.enrolprice : pricecalc.disc_total) || 0,
                        'endiscrate': enrolcount[eid] >=5 ? '100%' : pricecalc.disc_rate,
                        'endiscdescription': enrolcount[eid] >=5 ? '5th Week of Enrolment Free' : pricecalc.disc_desc,
                        'baseRate': (enrolments[i].baseRate) || 0,
                        'enrolmentOrder': i + 1
                    }
                    enrolments[i].classdate = moment(cd.startofweek).add((Number(enrolments[i].classday) - 1), 'd');
                    enrolments[i].startofweek = moment(cd.startofweek).format('YYYY-MM-DD');
                    delete enrolments[i].baseRate;
                }
                // Enrolments from Array to Object
                for (let i = 0; i < enrolments.length; i++) {
                    let id = enrolments[i].id;
                    enrols[cd.startofweek][id] = enrolments[i];
                }
            } else if (isObjectEmpty(enrols[cd.startofweek])) {
                delete enrols[cd.startofweek];
            }
        }
        return enrols;
    }

    ///// Billing Calculations
    /* e = enrolment, c = loop count, ec = enrolment count */
    async function pricingCalc(e, c, ec) {
        // return e.classType;
        let price = rawPriceCalc(e);
        let p = 0, discAmt;
        if (discSettings.enroldiscounts.enabled == 1) {
            if (discSettings.enroldiscounts.type == 'bulk') {
                discAmt = dbClientFlat(await db.raw(`SELECT * FROM perStudentDiscounts WHERE classType = '${e.classType}' AND enrolmentCount = '${ec}' LIMIT 1`));
            } else {
                discAmt = dbClientFlat(await db.raw(`SELECT * FROM perStudentDiscounts WHERE classType = '${e.classType}' AND enrolmentCount = '${c}' LIMIT 1`));
            }
            if (discAmt.discountType === 1) { // Discount type 1 == Percentage
                price['netamt'] = round(sum(price.enrolprice - (price.enrolprice * (discAmt.discountAmount / 100))),2);
                price['disc_total'] = round(sum(price.enrolprice - price.netamt),2);
                price['disc_rate'] = discAmt.discountAmount + '%';
                price['disc_desc'] = discAmt.description;
            } else {
                price['netamt'] = round(sum(price.enrolprice - discAmt.discountAmount),2);
                price['disc_total'] = round(sum(price.enrolprice - price.netamt),2);
                price['disc_rate'] = discAmt.discountAmount;
                price['disc_desc'] = discAmt.description;
            }
        }
        return price;
    }
    // Raw pricing
    function rawPriceCalc(e) {
        let calcreturn = {
            'enrolprice': 0,
            'priceoverride': false,
            'priceoverridetype': null
        }
        if (e.priceOverride === 1) {
            if (e.priceOverrideType === 'flat') {
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
    async function dateRange(dr, type) {
        if (type === 'month') {
            let start = moment(dr.start).startOf('week');
            let end = moment(dr.start).endOf('week');
            let curr = moment(dr.start);
            let range = {
                'arr': [0, 0, 0, 0, 0, 0, 0],
                'weekarr': [],
                'descriptor': moment(dr.start).format('MMMM - YYYY'),
                'start': dr.start,
                'end': dr.end
            }
            // Create Month Ranges
            while (curr.isSameOrBefore(moment(dr.end))) {
                range.arr[curr.day()] += 1;
                curr.add(1, 'd');
            }
            while (start.isSameOrBefore(moment(dr.end))) {
                let sow = start.month() != moment(dr.start).month() ? moment(dr.start).format('YYYY-MM-DD') : start.format('YYYY-MM-DD');
                let eow = end.month() != moment(dr.end).month() ? moment(dr.end).format('YYYY-MM-DD') : end.format('YYYY-MM-DD');
                let a = moment(sow).clone(),
                    dayint = [];
                while (a.isSameOrBefore(eow)) {
                    dayint.push(a.day() + 1);
                    a.add(1, 'd');
                }
                range.weekarr.push({
                    'startofweek': sow,
                    'endofweek': eow,
                    'dayint': dayint
                });
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
    let discArray = dbClient(await db.raw(`SELECT * FROM perStudentDiscounts WHERE classType = 1`));
    let discObj = arrayToObj(discArray, "enrolmentCount");
    // enrols[cd.startofweek]['discAmt'] = discObj;
    let feesobject = {
        //"students": studentsprocessed,
        "charges": familyprocessed,
        "familyid": fid,
        //"dates": {
        //    "current": dr_current,
        //    "next": dr_next
        //},
        //'discount_settings': discSettings,
        //'discAmt': discObj
    }

    return familyprocessed;
}