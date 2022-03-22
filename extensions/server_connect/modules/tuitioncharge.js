//const  = require('moment');
const moment = require('moment-timezone');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const crypto = require('crypto');

exports.tuitioncharge = async function (options) {

    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////


    // Parse Options
    options = this.parse(options);
    let d = JSON.parse(options.details),
        charge_date = options.charge_date,
        due_date = options.due_date,
        title = options.title,
        reference = options.reference,
        description = options.description,
        user = options.user,
        timestamp = moment().unix();

    let charge_exists = d.monthlychargeexists.exists;

    if (charge_exists) {
        // Update Family Charge
        await familycharge_update(d.monthlychargeexists.charge_uuid, d);

        // Match generated enrolment charges with existing charges. 
        // Update existing, Insert new and Delete unmatched.
        await enrolcharge_match(d.enrolments, d.monthlychargeexists.charge_uuid);

    } else {

        // Insert Family Charge
        let cuuid = await familycharge_insert(d);

        for (let i = 0; i < d.enrolments.length; i++) {
            let e = d.enrolments[i];
            await enrolcharge_insert(e, cuuid);
        }
    }

    async function enrolcharge_match(enrolments, charge_uuid) {

        let ec_matched = [];

        for (let i = 0; i < enrolments.length; i++) {
            let e = enrolments[i];
            let classdate = moment(e.classdate).format('YYYY-MM-DD');
            let ec = dbClientFlat(await db.raw(`
                SELECT ce.uuid
                FROM charges_enrolments ce
                WHERE 
                    charge_uuid = '${charge_uuid}' AND
                    enrolment_uuid = '${e.uuid}' AND
                    classDate = '${classdate}'
            `));

            // If uuid (ec) found, update, else insert new enrolment charge.
            if (ec) {
                await enrolcharge_update(ec.uuid, e);
                ec_matched.push(ec.uuid);
            } else {
                let new_ec_uuid = await enrolcharge_insert(e, charge_uuid);
                ec_matched.push(new_ec_uuid);
            }
        }
        await enrolcharges_delete_redundant(ec_matched, charge_uuid);

    }

    async function enrolcharge_insert(enrolment, charge_uuid) {
        let e = enrolment;
        let p = enrolment.pricing;
        let ceuuid = 'che_' + (crypto.randomUUID()).replaceAll('-', '');

        await db('charges_enrolments').insert(
            db.raw(`
                    ( 
                        uuid, startofweek, class_uuid, student_uuid, classtype_uuid, enrolment_uuid, classDate, baseRate, endisc, ennetrate, endiscdescription, endiscrate, familydiscountdesc, familydiscountrate, familydiscounttotal, enrolsubtotal, holding_fee, holding_fee_discount, enrolgrandtotal, charge_uuid, isvalid, debuggerstatus, created, created_by
                    )
                VALUES ( '${ceuuid}', '${e.startofweek}', '${e.class_uuid}', '${e.student_uuid}', '${e.classtype_uuid}', '${e.uuid}', '${moment(e.classdate).format('YYYY-MM-DD')}', ${p.baseRate}, ${p.endisc}, ${p.enNetRate}, '${p.endiscdescription}', '${p.endiscrate}', '${p.familydiscountdesc}', '${p.familydiscountrate}', ${p.familydiscounttotal}, ${p.enrolsubtotal}, ${p.holdingfee > 0 ? 1 : 0}, ${p.holdingfee}, ${p.enrolgrandtotal}, '${charge_uuid}', ${e.isValid}, 'insert', ${timestamp}, '${user}'
                )
            `)
        );

        return ceuuid;
    }

    async function enrolcharge_update(ecuuid, enrolment) {

        let p = enrolment.pricing;

        // Update enrolment charge
        await db.raw(`
                UPDATE charges_enrolments
                SET 
                    baseRate = ${p.baseRate}, endisc = ${p.endisc}, ennetrate = ${p.enNetRate}, endiscdescription = '${p.endiscdescription}', endiscrate = '${p.endiscrate}', familydiscountdesc = '${p.familydiscountdesc}', familydiscountrate = '${p.familydiscountrate}', familydiscounttotal = ${p.familydiscounttotal}, enrolsubtotal = ${p.enrolsubtotal}, enrolgrandtotal = ${p.enrolgrandtotal}, holding_fee = ${p.holdingfee > 0 ? 1 : 0}, holding_fee_discount = ${p.holdingfee}, debuggerstatus = 'updated', updated = ${timestamp}, updated_by = '${user}'
                WHERE uuid = '${ecuuid}'
                `
        );

    }

    async function enrolcharges_delete_redundant(arr, fcuuid) {
        if (arr.length == 0) {
            return;
        } else {
            arr = arr.map((i) => {
                return `'` + i + `'`
            }).toString();
        await db.raw(`
            DELETE
            FROM charges_enrolments ce
            WHERE ce.uuid NOT IN(${arr}) AND ce.charge_uuid = '${fcuuid}';
        `);

        }
    }

    async function familycharge_insert(d) {

        // Generate family charge UUID
        let uuid = 'chf_' + (crypto.randomUUID()).replaceAll('-', '');

        // Insert new family charge
        await db('charges_family')
                .insert(db.raw(`
                (
                    uuid, family_uuid, total, title, reference, description, chargeFor_monthly, dueDate, chargeType, basetotal, discounttotal, chargeDate, createdby, created
                )
                VALUES (
                    '${uuid}', '${d.family_uuid}', ${d.totals.enrolsgrand}, '${title}', ${'\'' + reference + '\'' || null}, ${'\'' + description + '\'' || null}, '${d.monthlycharge}', '${due_date}', 'tuition', ${d.totals.baseRate}, ${d.totals.disctotal}, '${charge_date}', '${user}', ${timestamp}
                )
        `));

        return uuid;
    }

    async function familycharge_update(fcuuid, details) {
        let d = details;
        await db.raw(`
            UPDATE charges_family
            SET 
                title = '${title}',
                ${description ? 'description = ' + description + ',' : ''} 
                ${reference ? 'reference = ' + reference + ',' : ''} 
                dueDate = '${due_date}', 
                chargeDate = '${charge_date}', 
                baseTotal = ${d.totals.baseRate}, 
                discounttotal = ${d.totals.disctotal}, 
                total = ${d.totals.enrolsgrand}
            WHERE uuid = '${fcuuid}'
        `);
    }


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

    return {
        "due_date": due_date,
        "charge_date": charge_date,
        "user": user
    }


}