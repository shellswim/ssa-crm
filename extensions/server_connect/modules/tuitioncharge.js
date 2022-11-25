const {DateTime} = require('luxon');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const e = require('express');

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
    let family_uuid = options.details.family_uuid;
    let charge_details = options.details;
    let charge_date = options.charge_date;
    let due_date = options.due_date;
    let title = options.title;
    let reference = options.reference || null;
    let description = options.description || null;
    let user = options.user.user;
    let ip_address = options.user.ip_address;
    debugger;
    let user_fullname = dbClientFlat(await db.raw(`
        SELECT CONCAT_WS(' ', firstName, lastName) AS name
        FROM db_users
        WHERE uuid = '${user}';
    `)).name;
    let timestamp = DateTime.now().toSeconds();
    let timestamp_millis = DateTime.now().toMillis();
    
    if (charge_details.existingcharge.chargeexists) {
        // Update Family Charge
        await familycharge_update(charge_details.existingcharge.details.uuid, charge_details);

        // Match generated enrolment charges with existing charges. 
        // Update existing, Insert new and Delete unmatched.
        await enrolcharge_match(charge_details.enrolments, charge_details.existingcharge.details.uuid);
        
        // Check if charge has enrolment_charge children. If not, delete charge.
        await childless_familycharge(charge_details.existingcharge.details.uuid);

    } else {
        if(charge_details.tuitiontotals.baseRate) {
            // Insert Family Charge
            let cuuid = await familycharge_insert(charge_details);
    
            for (let i = 0; i < charge_details.enrolments.length; i++) {
                let e = charge_details.enrolments[i];
                await enrolcharge_insert(e, cuuid);
            }
        }
    }

    async function enrolcharge_match(enrolments, charge_uuid) {

        let ec_matched = [];
        
        for (let i = 0; i < enrolments.length; i++) {
            let e = enrolments[i];
            let classdate = DateTime.fromSQL(e.classdate).toISODate();
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

        await db.raw(`
                INSERT INTO charges_enrolments ( 
                        uuid, startofweek, class_uuid, student_uuid, classtype_uuid, enrolment_uuid, classDate, classDate2, baseRate, endisc, ennetrate, endiscdescription, endiscrate, familydiscountdesc, familydiscountrate, familydiscounttotal, enrolsubtotal, holding_fee, holding_fee_discount, enrolgrandtotal, charge_uuid, isvalid, debuggerstatus, created, created_by
                    )
                VALUES ( '${ceuuid}', '${e.startofweek}', '${e.class_uuid}', '${e.student_uuid}', '${e.classtype_uuid}', '${e.uuid}', '${DateTime.fromSQL(e.classdate).toISODate()}', ${DateTime.fromSQL(e.classdate).toSeconds()}, ${p.baseRate}, ${p.multienrol_discount}, ${p.multienrol_subtotal}, '${p.multienrol_discount_description}', NULL, '${p.familydiscount_description}', NULL, ${p.family_discount}, ${p.familydiscount_subtotal}, ${p.holding_fee > 0 ? 1 : 0}, ${p.holding_fee}, ${p.enrolgrandtotal}, '${charge_uuid}', ${e.isValid}, 'insert', ${timestamp}, '${user}'
                )
            `
        );

        return ceuuid;
    }

    async function enrolcharge_update(ecuuid, enrolment) {

        let p = enrolment.pricing;

        // Update enrolment charge
        await db.raw(`
                UPDATE charges_enrolments
                SET 
                    classDate = '${DateTime.fromISO(enrolment.classdate).toISODate()}', 
                    classDate2 = ${DateTime.fromISO(enrolment.classdate).toSeconds()}, 
                    baseRate = ${p.baseRate}, 
                    endisc = ${p.multienrol_discount}, 
                    ennetrate = ${p.multienrol_subtotal}, 
                    endiscdescription = '${p.multienrol_discount_description}',
                    endiscrate = NULL, 
                    familydiscountdesc = '${p.familydiscount_description}',
                    familydiscountrate = NULL, familydiscounttotal = ${p.family_discount},
                    enrolsubtotal = ${p.familydiscount_subtotal},
                    enrolgrandtotal = ${p.enrolgrandtotal},
                    holding_fee = ${p.holding_fee > 0 ? 1 : 0},
                    holding_fee_discount = ${p.holding_fee},
                    debuggerstatus = 'updated',
                    updated = ${timestamp},
                    updated_by = '${user}'

                WHERE uuid = '${ecuuid}'
                `
        );

    }

    async function enrolcharges_delete_redundant(arr, fcuuid) {
        if (arr.length == 0) {
            arr = null;
        } else {
            arr = arr.map((i) => {
                return `'` + i + `'`
            }).toString();            
        }

        // Get charge IDs (not uuids) for logs.
        let charge_ids = dbClient(await db.raw(`
            SELECT ce.id
            FROM charges_enrolments ce
            WHERE ce.uuid NOT IN(${arr === null ? '\'\'' : arr}) AND ce.charge_uuid = '${fcuuid}';
        `));

        await db.raw(`
            DELETE
            FROM charges_enrolments ce
            WHERE ce.uuid NOT IN(${arr === null ? '\'\'' : arr}) AND ce.charge_uuid = '${fcuuid}';
        `);

        await db.raw(`
            INSERT INTO family_logs (
                uuid, family_uuid, log_type, log_category, logged_at, logged_by, ip_address, log
            )
            VALUES (
                '${'flo_' + (crypto.randomUUID()).replaceAll('-', '')}',
                '${family_uuid}',
                'deleted',
                'Charge',
                ${DateTime.now().toMillis()},
                '${user_fullname}',
                '${ip_address}',
                'Deleted enrolment charges (${charge_ids.map(c => { return c.id }).join(', ')}) due to a change in enrolment.'
            )
        `)

    }

    async function familycharge_insert(d) {

        // Generate family charge UUID
        let uuid = 'chf_' + (crypto.randomUUID()).replaceAll('-', '');

        // Insert new family charge
        await db.raw(`
                INSERT INTO charges_family (
                    uuid, family_uuid, total, title, reference, description, chargeFor_monthly, dueDate, chargeType, basetotal, discounttotal, chargeDate, createdby, created
                )
                VALUES (
                    '${uuid}', 
                    '${d.family_uuid}', 
                    ${d.tuitiontotals.enrolgrandtotal || 0.00}, 
                    ${title ? '\''+title+'\'' : '\'' + 'Family Tuition Charge: ' + DateTime.fromISO(d.chargefor_date).toFormat('MMMM yyyy')+'\''}, 
                    ${description ? '\''+description+'\'' : 'NULL'}, 
                    ${reference ? '\''+reference+'\'' : 'NULL'}, 
                    '${d.chargefor_date}', 
                    '${due_date || DateTime.now().toISODate()}', 
                    'tuition', 
                    ${d.tuitiontotals.baseRate || 0.00}, 
                    ${(d.tuitiontotals.family_discount - d.tuitiontotals.multienrol_discount - d.tuitiontotals.holding_fee).toFixed(2) || 0.00}, 
                    '${charge_date || DateTime.now().toISODate()}', 
                    '${user}', 
                    ${timestamp}
                )
        `);
        let log = `CREATED: Family charge "${title ? title : 'Family Tuition Charge: ' + DateTime.fromISO(d.chargefor_date).toFormat('MMMM yyyy')}". \nTotal: ${d.tuitiontotals.enrolgrandtotal || 0.00}`;
        await create_familylog('created','Charge',log);
        return uuid;
    }

    async function familycharge_update(charge_uuid, details) {
        let d = details;
        let disc_total = (d.tuitiontotals.family_discount - d.tuitiontotals.multienrol_discount - d.tuitiontotals.holding_fee).toFixed(2);
        if(isNaN(disc_total)) disc_total = 0.00;
        let charge = dbClientFlat(await db.raw(`
            SELECT *
            FROM charges_family
            WHERE uuid = '${charge_uuid}'
        `));
        if(charge.title !== title || charge.description !== description || charge.reference !== reference || charge.basetotal !== d.tuitiontotals.baseRate || charge.discounttotal !== Number(disc_total) || charge.total !== d.tuitiontotals.enrolgrandtotal) {
            debugger;
            await db.raw(`
                UPDATE charges_family
                SET 
                    ${title ? 'title = \'' + title + '\',' : '' }
                    ${description ? 'description = \'' + description + '\',' : ''}
                    ${reference ? 'reference = \'' + reference + '\',' : ''}
                    ${due_date ? 'dueDate = \'' + due_date + '\',' : ''}
                    ${charge_date ? 'chargeDate = \'' + charge_date + '\',' : ''}
                    baseTotal = ${d.tuitiontotals.baseRate || 0.00}, 
                    discounttotal = ${disc_total == NaN ? 0.00 : disc_total}, 
                    total = ${d.tuitiontotals.enrolgrandtotal || 0.00}
                WHERE uuid = '${charge_uuid}'
            `);
            let log = `UPDATED: Family Charge "${charge.title}"`
            await create_familylog('updated','Charge',log);
        }
    }

    async function childless_familycharge(charge_uuid) {
        let charges = dbClient(await db.raw(`
            SELECT ce.uuid
            FROM charges_enrolments ce
            WHERE ce.charge_uuid = '${charge_uuid}'
        `));
        if(charges.length === 0) {
            let chargetitle = dbClientFlat(await db.raw(`
                SELECT cf.title
                FROM charges_family cf
                WHERE cf.uuid = '${charge_uuid}'
            `)).title;
            await db.raw(`
                DELETE FROM
                charges_family cf
                WHERE cf.uuid = '${charge_uuid}';
            `);
            // Create log;
            let log = `DELETED: Family charge "${chargetitle}" was deleted. \nNo enrolments were found for this charge and it was subsequently removed.`;
            await create_familylog('deleted','Charge',log)
        }
    }

    async function create_familylog(log_type, log_category, log) {
        let log_uuid = 'flo_' + (crypto.randomUUID()).replaceAll('-', '');
        await db.raw(`
            INSERT INTO 
            family_logs (
                uuid,
                family_uuid,
                log_type,
                log_category,
                logged_at,
                logged_by,
                ip_address,
                log
            )
            VALUES(
                '${log_uuid}',
                '${family_uuid}',
                '${log_type}',
                '${log_category}',
                ${timestamp_millis},
                '${user_fullname}',
                '${ip_address}',
                '${log}'
            )
        `)
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