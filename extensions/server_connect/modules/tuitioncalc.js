const {
    DateTime
} = require('luxon');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const {
    evaluate,
    sum,
    chain: mathchain,
    round
} = require('mathjs');

exports.tuitioncalc = async function (options) {

    options = this.parse(options);
    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////

    /** Dates variables setup */
    let startofmonth = DateTime.fromISO(options.monthtoprocess).startOf('month').startOf('week');
    let endofmonth = DateTime.fromISO(options.monthtoprocess).endOf('month').endOf('week');
    let weekstart = dbClientFlat(await db.raw(`
        SELECT s.value
        FROM settings s
        WHERE name = 'weekstart'
    `)).value;

    if(weekstart.toLowerCase() == 'sunday') {
        startofmonth = startofmonth.minus({days: 1});
        endofmonth = endofmonth.minus({days: 1});
    }
    let generateweeks = generateWeeks(startofmonth, endofmonth);
    let timespan = generateweeks.daysarr;
    let daysinmonth = generateweeks.daysinmonth;

    /** Family, discounts and setup */
    let family_uuid = options.family_uuid;
    let _discounts = await discountmatrix();

    /** Check if charge exists for current month */
    let multipleChargeExists, chargeexists;
    let find_chargeexists = dbClient(await db.raw(`
        SELECT cf.uuid
        FROM charges_family cf
        WHERE cf.chargeFor_monthly = '${DateTime.fromISO(options.monthtoprocess).startOf('month').toFormat('yyyy-MM-dd')}' AND cf.family_uuid = '${family_uuid}'
    `)) || [];

    switch (true) {
        case (find_chargeexists.length = 1):
            chargeexists = true;
            multipleChargeExists = false;
            break;
        case (find_chargeexists.length > 1):
            chargeexists = true;
            multipleChargeExists = true;
            break;

    }

    /** Students and Enrolments Setup */
    let dummyenrol = options.dummyEnrolEnabled;
    let dummyJSON = options.dummyEnrolJSON ? JSON.parse(this.parse(options.dummyEnrolJSON)) : null;
    let students = await getStudents();
    students.map(s => {
        s.enrolments = array_clone(timespan);
        return s;
    });

    for (let i = 0; i < students.length; i++) {
        let student = students[i];
        let enrolments = students[i].enrolments;
        student.total_enrolments = 0;

        // Get enrolments for each week
        for (let j = 0; j < enrolments.length; j++) {
            let se = student.enrolments[j];
            se.items = [];

            for (let k = 0; k < se.days.length; k++) {
                dayint = se.days[k].dayint;
                let enrolquery = await getEnrolments(student.uuid, se.start, se.end, dayint);
                se.items.push(enrolquery);
            }
            se.items = _.flatten(se.items);

            // Set total enrolments for week.
            se.total_enrolments = se.items.length; // await getEnrolmentCalWeekCount(student.uuid, se.start, se.end);
            student.total_enrolments += se.items.length;
        }
    }

    /** Tuitions Calculations */
    // Filter out students who have no enrolments
    students = students.filter(s => {
        return s.total_enrolments > 0;
    });

    // Process multienrolment discounts
    for (let i = 0; i < students.length; i++) {
        let s = students[i];
        s.tuitiontotals = {};
        s.enrolments = s.enrolments.filter(e => {
            return e.items.length > 0
        });
        for (let j = 0; j < students[i].enrolments.length; j++) {
            let e = s.enrolments[j];
            e.tuitiontotals = {};
            for (let k = 0; k < e.items.length; k++) {
                let item = e.items[k];
                item.pricing = {
                    'baseRate': item.baseRate
                };
                object_merge(item.pricing, process_studentDiscounts(item, e.total_enrolments, (j + 1)));
                e.tuitiontotals = object_mathMerge(e.tuitiontotals, item.pricing, 'multienrol_discount_description');
                s.tuitiontotals = object_mathMerge(s.tuitiontotals, item.pricing, 'multienrol_discount_description');
            }
        }
    }

    // Sort students, then apply family discounts.
    students = _.sortBy(students, (o) => {
        return o.tuitiontotals.multienrol_subtotal
    }).reverse().map((s, i) => {
        if (_discounts.family.type == 'bulk') {
            s.familyorder = students.length;
        } else {
            s.familyorder = i + 1;
        }
        return s;
    });

    // Apply family discounts && holding fees
    for (let i = 0; i < students.length; i++) {
        let s = students[i];
        let final_fees_object = {};

        for (let j = 0; j < s.enrolments.length; j++) {
            let e = s.enrolments[j];

            for (let k = 0; k < e.items.length; k++) {
                let item = e.items[k];

                // Process and add family discounts to item pricing object.
                let familydiscounts = process_familyDiscounts(s, item);
                object_merge(item.pricing, familydiscounts);

                // Math merge family discounts into weekly total.
                object_mathMerge(e.tuitiontotals, familydiscounts, 'familydiscount_description');

                /** Holding Fee */
                let holding_fee = await holdingFee(item);

                if (!Object.hasOwn(e.tuitiontotals, 'enrolgrandtotal')) {
                    e.tuitiontotals.enrolgrandtotal = 0;
                }

                item.pricing.holding_fee = holding_fee;
                item.pricing.enrolgrandtotal = mathchain(evaluate(`${familydiscounts.familydiscount_subtotal} - ${holding_fee}`)).round(2).done();;

                // set fee object to mathMerge with student tuition totals object
                fees_object = {
                    'holding_fee': holding_fee,
                    'enrolgrandtotal': item.pricing.enrolgrandtotal
                };
                object_mathMerge(e.tuitiontotals, fees_object);

                // math merge all new familydiscount, holding_fee and enrolgrandtotal objects to final_fees_object for student total pricing.
                object_mathMerge(final_fees_object, [familydiscounts, fees_object], 'familydiscount_description');
            }

            delete e.days;
        }

        object_mathMerge(s.tuitiontotals, final_fees_object);
    }

    /** Functions Start */
    // Discounts
    async function discountmatrix() {
        let _matrix = {};

        // Get Discount Settings
        // Family discounts
        let fd_direction = dbClientFlat(await db.raw(`SELECT s.value FROM settings s WHERE name = 'fdiscount_lowest_total_fees_first'`)).value;
        let fd_type = dbClientFlat(await db.raw(`SELECT s.value FROM settings s WHERE name = 'fdiscount_type'`)).value;
        let fd_matrix = dbClient(await db.raw(`SELECT * FROM perFamilyDiscounts ORDER BY studentCount`));

        // Student discounts
        // sd_type = 'bulk' or 'perenrol'. Perenrol assigns a count number to each enrolment, then uses the matrix to discount based on number.
        let sd_type = dbClientFlat(await db.raw(`SELECT s.value FROM settings s WHERE name = 'endiscount_type'`)).value;
        let sd_matrix = dbClient(await db.raw(`SELECT * FROM perStudentDiscounts ORDER BY enrolmentCount`));

        _matrix["family"] = {
            "direction": fd_direction,
            "type": fd_type,
            get discounts() {
                if (Array.isArray(fd_matrix)) {
                    let output = [],
                        fd = fd_matrix;
                    for (let i = 0; i < fd.length; i++) {
                        let f = fd[i];
                        output.push({
                            "type": f.discountType,
                            "count": f.studentCount,
                            "rate": f.discountAmount,
                            "description": f.description
                        });
                    }
                    return output;
                }
            }
        }
        _matrix["student"] = {
            "type": sd_type,
            get discounts() {
                let output = [],
                    sd = sd_matrix;
                if (Array.isArray(sd)) {
                    for (let i = 0; i < sd.length; i++) {
                        let s = sd[i];
                        output.push({
                            "type": s.discountType,
                            "rate": s.discountAmount,
                            "count": s.enrolmentCount,
                            "class_type": s.classtype_uuid,
                            "description": s.description
                        });
                    }
                }
                return output;
            }
        }
        _matrix.billing_cycle = Number(dbClientFlat(await db.raw(`SELECT s.value FROM settings s WHERE name = 'billing_cycle'`)).value);

        return _matrix;
    }

    function process_studentDiscounts(item, total_enrolments, week) {
        let sd = _discounts.student;
        let discount = {};
        if (sd.type.toLowerCase() == 'bulk') {
            if (_discounts.billing_cycle == 3 && week >= 5 && daysinmonth[item.classday] == 5) {
                discount = {
                    'multienrol_discount': item.baseRate,
                    'multienrol_subtotal': 0,
                    'multienrol_discount_description': '5th Week Free'
                }
            } else {
                let find_discount = sd.discounts.find(d => {
                    return (d.count == total_enrolments && d.class_type == item.classtype_uuid);
                });
                if (!find_discount) {
                    discount = {
                        'multienrol_discount': 0,
                        'multienrol_subtotal': item.baseRate,
                        'multienrol_discount_description': '-'
                    }
                } else {
                    // set discounts.
                    discount = {
                        'multienrol_discount': calcDiscount(item.baseRate, find_discount.rate, find_discount.type),
                        get multienrol_subtotal() {
                            return evaluate(`${item.baseRate} - ${this.multienrol_discount}`)
                        },
                        'multienrol_discount_description': find_discount.description
                    }
                }
            }
        }
        return discount;
    }

    function process_familyDiscounts(student, enrol_item) {
        let fd = _discounts.family,
            e = enrol_item;
        let discount = {
            'family_discount': 0,
            'familydiscount_subtotal': 0
        };
        let studentcount = student.familyorder;
        let find_discount = fd.discounts.find(d => {
            return d.count == studentcount;
        });
        if (Object.keys(find_discount).length > 0) {
            discount.family_discount = calcDiscount(e.pricing.multienrol_subtotal, find_discount.rate, find_discount.type);
            discount.familydiscount_subtotal = mathchain(sum(e.pricing.multienrol_subtotal - discount.family_discount)).round(2).done();
            discount.familydiscount_description = find_discount.description;
        }
        return discount;
    }

    // Students and enrolments
    async function getStudents() {
        let students = dbClient(await db.raw(`
            SELECT *
            FROM students s
            WHERE s.family = '${family_uuid}'
        `));

        return students;
    }

    async function getEnrolmentCalWeekCount(studentid, start, end) {
        let enrolcount = dbClientFlat(await db.raw(`
            SELECT COUNT(e.uuid) AS count
            FROM enrolments e
            WHERE e.student_uuid = '${studentid}' AND
            e.enrolmentType = 1 
            AND (e.dropDate IS NULL 
                OR e.dropDate >= '${start}'
                OR e.dropDate BETWEEN '${start}' AND '${end}') 
            AND (e.startDate <= '${end}' OR e.startDate BETWEEN '${start}' AND '${end}')
        `)).count;

        return enrolcount;
    }

    async function getEnrolments(studentid, start, end, dayint) {
        let enrolments = dbClient(await db.raw(`
            SELECT e.*, c.day AS classday, c.classType AS classType, c.classtype_uuid, ct.baseRate, ct.shortName, s.firstName, s.lastName, c.instructor_uuid, c.classlevel_uuid, c.startTimeDisplay
            FROM enrolments e 
                LEFT JOIN students s ON e.student_uuid = s.uuid
                LEFT JOIN classes c ON e.class_uuid = c.uuid 
                LEFT JOIN classTypes ct ON c.classtype_uuid = ct.uuid
                WHERE e.student_uuid = '${studentid}' AND
                e.enrolmentType = 1 
                AND (e.dropDate IS NULL 
                    OR e.dropDate >= '${start}'
                    OR e.dropDate BETWEEN '${start}' AND '${end}') 
                AND (e.startDate <= '${end}' OR e.startDate BETWEEN '${start}' AND '${end}')
                AND c.day IN(${dayint})
                ORDER BY c.day, c.startTimeDecimal
        `));
        enrolments.map(e => {
            let add_days = dayint - 1;
            e.classdate_timestamp = DateTime.fromISO(start).plus({
                days: add_days
            }).toSeconds()
            e.classdate = DateTime.fromISO(start).plus({
                days: add_days
            }).toISODate();
        });

        if (!Array.isArray(enrolments)) {
            enrolments = [];
        }
        if (dummyenrol && dummyJSON.student_uuid == studentid && dummyJSON.classday == dayint) {
            enrolments.push({
                "classday": dummyJSON.classday,
                "classType": dummyJSON.classType,
                "classtype_uuid": dummyJSON.classtype_uuid,
                "baseRate": dummyJSON.baseRate,
                "shortName": dummyJSON.shortName,
                "firstName": dummyJSON.firstName,
                "lastName": dummyJSON.lastName,
                "instructor_uuid": dummyJSON.instructor_uuid,
                "classlevel_uuid": dummyJSON.classlevel_uuid,
                "startTimeDisplay": dummyJSON.startTimeDisplay,
                "enrolmentType": dummyJSON.enrolmentType,
                "dropDate": dummyJSON.dropDate,
                "isValid": dummyJSON.isValid,
                "startDate": dummyJSON.startDate,
                "student_uuid": dummyJSON.student_uuid,
                "class_uuid": 'dummy'
            });
        }
        return enrolments;
    }

    // Holding Fee Processor
    async function holdingFee(enrolment) {
        if (enrolment.class_uuid == 'dummy') {
            return 0.00;
        }
        let hf_return;
        let en = enrolment;

        let hf = dbClientFlat(await db.raw(`
            SELECT hf.*
            FROM holding_fees hf
            WHERE hf.enrolment_uuid = '${en.uuid}' AND hf.absence_date = ${en.classdate_timestamp}
        `));

        if (hf === null || hf === undefined) {
            hf_return = 0.00;
        } else {
            if (hf.holding_fee_type == 'percentage') {
                hf_return = mathchain(evaluate(`${en.pricing.familydiscount_subtotal} - (${en.pricing.familydiscount_subtotal} * (${hf.holding_fee} / 100))`)).round(2).done();
            } else {
                hf_return = mathchain(evaluate(`${en.familydiscount_subtotal} - ${hf.holding_fee}`)).round(2).done();
            }
        }
        return hf_return;
    }

    // Utilities
    function generateWeeks(countstart, countend) {
        let start = countstart,
            end = countend;
        let arr = [];
        let daysinmonth = {};

        // Build week profile
        while (start <= end) {
            arr.push({
                "start": start,
                "end": start.plus({
                    days: 6
                })
            });
            start = start.plus({
                weeks: 1
            });
        }

        // Map array and exclude days not in month to process.
        arr = arr.map(function (e) {
            let start = e.start,
                end = e.end;
            e['days'] = [];
            let cursor = start;
            while (cursor.ts >= start.ts && cursor.ts <= end.ts) {
                if (cursor.ts < DateTime.fromISO(options.monthtoprocess).startOf('month').ts ||
                    cursor.ts > DateTime.fromISO(options.monthtoprocess).endOf('month').ts) {
                    // Do not add days to array. They are outside of monthly scope.
                    cursor = cursor.plus({
                        day: 1
                    });
                    continue;
                } else {
                    // Add days to array. They are inside monthly scope.
                    e['days'].push({
                        "date": cursor.toISODate(),
                        "dayint": cursor.weekday,
                        "day": cursor.weekdayShort
                    });
                    if (!Object.hasOwn(daysinmonth, cursor.weekday)) {
                        daysinmonth[cursor.weekday] = 1
                    } else {
                        daysinmonth[cursor.weekday] += 1
                    }
                    cursor = cursor.plus({
                        day: 1
                    });
                }
            }
            // Convert to ISO 'YYYY-MM-DD' format for array.
            e.start = e.start.toISODate();
            e.end = e.end.toISODate();

            return e;
        }).filter(e => {
            // Filter out weeks of the month with no days in it.
            return e.days.length > 0;
        });
        return {
            "daysarr": arr,
            "daysinmonth": daysinmonth
        }
    };

    function calcDiscount(base, discount, type) {
        if (Number(type) === 1) {
            return mathchain(evaluate(`${base} * (${discount} / 100)`)).round(2).done();
        } else {
            return discount;
        }
    }

    function object_mathMerge(o, t, exclude_keys = '') {
        let q = o;
        let p;
        let exclude;
        if (exclude_keys.length > 0) {
            exclude = exclude_keys.replaceAll(', ', ',').split(',');
        } else {
            exclude = [];
        }
        if (Array.isArray(t)) {
            p = {}
            for (let i = 0; i < t.length; i++) {
                object_merge(p, t[i]);
            }
        } else {
            p = t;
        }
        for (let key in p) {
            if (exclude.includes(key)) {
                continue;
            }
            if (Object.hasOwn(q, key) && typeof o[key] == 'number' && typeof p[key] == 'number') {
                q[key] = mathchain(sum(q[key] + p[key])).round(2).done();
            } else if (Object.hasOwn(q, key) && !(typeof o[key] == 'number' || typeof p[key] == 'number')) {
                continue;
            } else {
                q[key] = p[key];
            }
        }
        return q;
    }

    function object_merge(o, p) {
        let q = o;
        for (let key in p) {
            if (Object.hasOwn(q, key)) {
                continue;
            } else {
                q[key] = p[key]
            }
        }
        return q;
    }

    function array_clone(a) {
        return JSON.parse(JSON.stringify(a));
    }

    // DB Query Processor
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


    return {
        "students": students,
        get tuitiontotals() {
            let totals = {};
            this.students.map(s => {
                object_mathMerge(totals, s.tuitiontotals);
            });
            return totals;
        },
        'chargefor': DateTime.fromISO(options.monthtoprocess).toFormat('MMM yyyy'),
        'existingcharge': {
            'chargeexists': chargeexists,
            'multiplecharges': multipleChargeExists,
            'details': find_chargeexists
        },
        'time': DateTime.fromObject({
            year: 2022,
            month: 02,
            day: 28,
            hour: 12
        }).setZone('Australia/Sydney').toISOTime()
    };
}