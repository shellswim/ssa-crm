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
    debugger;
    /** Dates variables setup */
    let startofcalendarmonth = DateTime.fromISO(options.monthtoprocess).startOf('month').startOf('week');
    let endofcalendarmonth = DateTime.fromISO(options.monthtoprocess).endOf('month').endOf('week');
    let startofmonth = DateTime.fromISO(options.monthtoprocess).startOf('month');
    let endofmonth = DateTime.fromISO(options.monthtoprocess).endOf('month');
    let weekstart = dbClientFlat(await db.raw(`
        SELECT s.value
        FROM settings s
        WHERE name = 'weekstart'
    `)).value;

    if(weekstart.toLowerCase() == 'sunday') {
        startofcalendarmonth = startofcalendarmonth.minus({days: 1});
        endofcalendarmonth = endofcalendarmonth.minus({days: 1});
    }
    let generateweeks = generateWeeks(startofcalendarmonth, endofcalendarmonth);
    let timespan = generateweeks.daysarr;

    // Date / Days in month counter.
    let dategen = (function dates_generator() {
        let halting_variable = 1;
        let obj_month = DateTime.fromISO(options.monthtoprocess), 
            start = obj_month.startOf('month').startOf('week'), 
            end = obj_month.endOf('month').endOf('week'), 
            month = obj_month.month, 
            cursor = start, 
            date_obj = {}, 
            day_obj = {1:0,2:0,3:0,4:0,5:0,6:0,7:0};
        while(cursor.ts >= start.ts && cursor.ts <= end.ts && halting_variable <= 1000) {
          if(cursor.month === month) {
            day_obj[cursor.weekday] += 1;
            date_obj[cursor.toISODate()] = day_obj[cursor.weekday];
          }
          cursor = cursor.plus({days: 1});
          halting_variable += 1;
          if(halting_variable === 1000) {
              throw new Error('Infinite loop in DateGen detected. Check your *monthtoprocess* date input.')
          }
        }
        return {
          date_obj, day_obj
        }
      })();

    /** Global Arrays & Objects*/
    let enrolment_counts = {};
    let family_enrolments = [];

    /** Family, discounts and setup */
    let family_uuid = options.family_uuid;
    let _discounts = await discountmatrix();

    /** Price Overrides values */
    let priceoverride = dbClientFlat(await db.raw(`
      SELECT value
      FROM settings
      WHERE name = 'price_override_enable'
    `)).value;
    let priceoverride_discounts = dbClientFlat(await db.raw(`
      SELECT value
      FROM settings
      WHERE name = 'price_override_discount_enable'
    `)).value;

    /** Check if charge exists for current month */
    let multipleChargeExists = false, chargeexists = false;
    let find_chargeexists = dbClient(await db.raw(`
        SELECT *
        FROM charges_family cf
        WHERE cf.chargeFor_monthly = '${DateTime.fromISO(options.monthtoprocess).startOf('month').toISODate('yyyy-MM-dd')}' AND cf.family_uuid = '${family_uuid}'
    `)) || [];

    switch (true) {
        case (find_chargeexists.length == 1):
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
    let discount_start_from_timestamp;
    if(dummyenrol == true && dummyJSON.startDate) {
        discount_start_from_timestamp = DateTime.fromISO(dummyJSON.startDate).toSeconds();
    }
    let students = await getStudents();
    students.map(s => {
        s.enrolments = array_clone(timespan);
        return s;
    });

    for (let i = 0; i < students.length; i++) {
        let student = students[i];
        student.all_enrolments = [], student.enrolment_uuids = [];
        let enrolments = students[i].enrolments;
        student.total_enrolments = 0;
        let groupedenrolments = {};

        // Set student key in enrolments count global object
        enrolment_counts[student.uuid] = {};

        // Get enrolments for each week
        for (let j = 0; j < enrolments.length; j++) {
            let se = student.enrolments[j];
            se.startofmonth = startofmonth.toISODate();
            se.endofmonth = endofmonth.toSeconds();
            se.items = [];
            se.dummyactive = false;
            let totals = [];

            for (let k = 0; k < se.days.length; k++) {
                dayint = se.calendar_days[k].dayint;
                let enrolquery = await getEnrolments(student.uuid, se.start, se.end, dayint);
                // Remove enrolments whose dropdate is before current class date.
                enrolquery.enrolments.map(e => {
                    // Filter enrolments falling outside of current month.
                    if(e.classdate_timestamp >= startofmonth.toSeconds() && e.classdate_timestamp <= endofmonth.toSeconds()) {
                        se.items.push(e);
                        student.all_enrolments.push(e);

                        // Group enrolments for Quote table
                        if(!Object.hasOwn(groupedenrolments, e.uuid)) {
                            groupedenrolments[e.uuid] = {
                                'classday': e.classday,
                                'startDate': e.startDate,
                                'dropDate': e.dropDate,
                                'instructor_uuid': e.instructor_uuid,
                                'classlevel_uuid': e.classlevel_uuid,
                                'items': [],
                                'total': 0
                            };
                        }
                        groupedenrolments[e.uuid].items.push(e);

                        if(!student.enrolment_uuids.includes(e.uuid)) student.enrolment_uuids.push(e.uuid);
                        // Set enrolment count for current enrolment in global enrolments count object.
                        if(Object.hasOwn(enrolment_counts[student.uuid], e.uuid)) {
                            enrolment_counts[student.uuid][e.uuid].count += 1;
                            enrolment_counts[student.uuid][e.uuid].classdate.push(e.classdate);
                        } else {
                            enrolment_counts[student.uuid][e.uuid] = {};
                            enrolment_counts[student.uuid][e.uuid].count = 1;
                            enrolment_counts[student.uuid][e.uuid]['classdate'] = [e.classdate]
                        }
                    }
                    if(e.class_uuid == "dummy") {
                        se.dummyactive = true;
                    }

                });
                if(enrolquery.dummyactive) {
                    dummyactive = true;
                }
                se.discount_start_from_timestamp = enrolquery.discount_start_from_timestamp;
                totals.push(enrolquery.total_enrolments);
            }
            se.items = _.flatten(se.items);

            // Set total enrolments for week.
            se.total_enrolments = totals.reduce((a,b)=>{
                return a+b;
            });
            student.total_enrolments += se.items.length;
        }

        student.groupedenrolments = groupedenrolments;
    }
    debugger;
    /** Tuitions Calculations */
    // Filter out students who have no enrolments
    students = students.filter(s => {
        return s.total_enrolments > 0;
    });

    // Group Enrolments for Quote Repeats


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
                object_merge(item.pricing, process_studentDiscounts(item, e.total_enrolments, (j + 1), e.dummyactive));
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

    // Filter family_enrolments to this month.
    family_enrolments = family_enrolments.filter((e) => {
        return e.classdate_timestamp >= startofmonth.toSeconds() && e.classdate_timestamp <= endofmonth.toSeconds()
    })

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

    function process_studentDiscounts(item, total_enrolments, week, dummyactive) {
        let sd = _discounts.student;
        let discount = {};
        let find_discount;
        let te;
        if(dummyactive && item.classdate_timestamp < discount_start_from_timestamp){
            if(total_enrolments - 1 == 0) {
                te = 1;
            } else {
                te = total_enrolments - 1;
            }
        } else {
            te = total_enrolments;
        }
        if (sd.type.toLowerCase() == 'bulk') {
            if (_discounts.billing_cycle == 3 && dategen.date_obj[DateTime.fromSQL(item.classdate).toISODate()] == 5 && enrolment_counts[item.student_uuid][item.uuid].count == 5) {
                discount = {
                    'multienrol_discount': item.baseRate,
                    'multienrol_subtotal': 0,
                    'multienrol_discount_description': '5th Week Free'
                }
            } else {
                find_discount = sd.discounts.find(d => {
                    return (d.count == te && d.class_type == item.classtype_uuid);
                });
                if (!find_discount) {
                    discount = {
                        'multienrol_discount': 0,
                        'multienrol_subtotal': item.baseRate,
                        'multienrol_discount_description': '-'
                    }
                } else {
                    // Check price overrides
                    if(priceoverride == 1 && priceoverride_discounts == 0 && item.priceOverride == 1) {
                        discount = {
                            'multienrol_discount': 0,
                            'multienrol_subtotal': item.baseRate,
                            'multienrol_discount_description': 'Price overriden. Discounts not applicable.'
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
        if(priceoverride == 1 && priceoverride_discounts == 0 && e.priceOverride == 1) {
            discount.familydiscount_description = 'Price overridden. Family discounts not applicable.';
            discount.familydiscount_subtotal = e.baseRate;
            return discount;
        }
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

        let enrols_array = [];
        let enrolments = dbClient(await db.raw(`
            SELECT e.*, c.day AS classday, c.classType AS classType, c.classtype_uuid, ct.shortName, s.firstName, s.lastName, c.instructor_uuid, c.classlevel_uuid, c.startTimeDisplay, '${start}' AS startofweek 
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
                AND e.deleted = 0
                ORDER BY c.day, c.startTimeDecimal
        `));
        if(enrolments.length > 0) 
        for(let i=0;i<enrolments.length;i++) {
            let e = enrolments[i];
            let add_days = dayint - 1, dropdate = DateTime.fromJSDate(e.dropDate).toSeconds(), startdate = DateTime.fromJSDate(e.startDate).toSeconds();
            e.classdate_timestamp = DateTime.fromISO(start).plus({days: add_days}).toSeconds();
            e.classdate = DateTime.fromISO(start).plus({days: add_days}).toISODate();

            // If dropdate is < class date, or startdate > class date, stop execution of current loop and deny push of enrolment to array.
            if(dropdate && dropdate < e.classdate_timestamp) continue;
            if(startdate > e.classdate_timestamp) continue;

            // Add Base Rates
            if(priceoverride == 1 && e.priceOverride == 1) {
                e.baseRate = e.priceOverrideValue;
            } else {
                e.baseRate = dbClientSingleValue(await db.raw(`
                    SELECT cb.baserate
                    FROM charges_baserates cb
                    WHERE 
                        '${e.classdate}' BETWEEN IFNULL(cb.effective_date,'1900-01-01') AND IFNULL(cb.end_date,'2999-01-01')
                        AND cb.classlevel_uuid = '${e.classlevel_uuid}';
                `),'baserate');
            }

            enrols_array.push(e);
        }
        // enrolments = enrolments.filter(e => {
        //     return DateTime.fromSQL(e.dropDate).toSeconds() > e.classdate_timestamp;
        // });

        if (dummyenrol && dummyJSON?.student_uuid == studentid && dummyJSON?.classday == dayint && DateTime.fromISO(dummyJSON?.startDate).toSeconds() <= DateTime.fromISO(end).toSeconds() && (dummyJSON?.dropDate ? DateTime.fromISO(dummyJSON?.dropDate).toSeconds() >= DateTime.fromISO(start).plus({days: dayint - 1}).toSeconds() : true)) {
            let classdate_timestamp = DateTime.fromISO(start).plus({days: dayint - 1}).toSeconds();
            let classdate = DateTime.fromISO(start).plus({days: dayint - 1}).toISODate();
            let baserate = dbClientSingleValue(await db.raw(`
            SELECT cb.baserate
            FROM charges_baserates cb
            WHERE 
                '${classdate}' BETWEEN IFNULL(cb.effective_date,'1900-01-01') AND IFNULL(cb.end_date,'2999-01-01')
                AND cb.classlevel_uuid = '${dummyJSON.classlevel_uuid}';
            `),'baserate');
            enrols_array.push({
                "classday": dummyJSON.classday,
                "classdate_timestamp": classdate_timestamp,
                "classdate": classdate,
                "classType": dummyJSON.classType,
                "classtype_uuid": dummyJSON.classtype_uuid,
                "baseRate": baserate,
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
                "class_uuid": dummyJSON.class_uuid,
                "startofweek": start,
                "uuid": 'dummy',
            });
        }
        if(Array.isArray(enrols_array) && enrols_array.length > 0) {
            enrols_array.map(e => {
                family_enrolments.push(e);
                if(e.enrolmentType !== 1) {
                    e.baseRate = 0.00;
                }
            });
        }
        return {
            'enrolments': enrols_array,
            'total_enrolments': enrols_array.length
        };
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
            e['calendar_days'] = [];
            let cursor = start;
            while (cursor.ts >= start.ts && cursor.ts <= end.ts) {
                // Add days to both 'days' & 'calendar_days' array.
                e['days'].push({
                    "date": cursor.toISODate(),
                    "dayint": cursor.weekday,
                    "day": cursor.weekdayShort
                });
                e['calendar_days'].push({
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
                // if (cursor.ts < DateTime.fromISO(options.monthtoprocess).startOf('month').ts ||
                //     cursor.ts > DateTime.fromISO(options.monthtoprocess).endOf('month').ts) {
                //     // Do not add days to 'days' array. They are outside of monthly scope.
                //     // Still add to 'calendar_days' array for correct enrolment discounts.
                //     e['calendar_days'].push({
                //         "date": cursor.toISODate(),
                //         "dayint": cursor.weekday,
                //         "day": cursor.weekdayShort
                //     });
                //     cursor = cursor.plus({
                //         day: 1
                //     });
                //     continue;
                // } else {

                //     // Add days to both 'days' & 'calendar_days' array.
                //     e['days'].push({
                //         "date": cursor.toISODate(),
                //         "dayint": cursor.weekday,
                //         "day": cursor.weekdayShort
                //     });
                //     e['calendar_days'].push({
                //         "date": cursor.toISODate(),
                //         "dayint": cursor.weekday,
                //         "day": cursor.weekdayShort
                //     });
                //     if (!Object.hasOwn(daysinmonth, cursor.weekday)) {
                //         daysinmonth[cursor.weekday] = 1
                //     } else {
                //         daysinmonth[cursor.weekday] += 1
                //     }
                //     cursor = cursor.plus({
                //         day: 1
                //     });
                // }
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
    function dbClientSingleValue(v,p) {
        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            return v[0][0][p];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            return v = v.rows;
        }
    }
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
        "family_uuid": options.family_uuid,
        "students": students,
        get tuitiontotals() {
            let totals = {};
            this.students.map(s => {
                object_mathMerge(totals, s.tuitiontotals);
            });
            return totals;
        },
        'chargefor': DateTime.fromISO(options.monthtoprocess).toFormat('MMM yyyy'),
        'chargefor_date': DateTime.fromISO(options.monthtoprocess).toISODate(),
        'discount_from_timestamp': discount_start_from_timestamp,
        'enrolment_counts': enrolment_counts,
        'existingcharge': {
            'chargeexists': chargeexists,
            'multiplecharges': multipleChargeExists,
            'details': find_chargeexists.length > 1 ? find_chargeexists : find_chargeexists[0],
        },
        'enrolments': family_enrolments
    };

}