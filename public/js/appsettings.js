function appSettingsObject() {
    var l = dmx.parse('sc_appSettings.data.getSettings'),
        cl = dmx.parse('sc_appSettings.data.query_levels'),
        et = dmx.parse('sc_appSettings.data.query_enroltypes'),
        rl = dmx.parse('sc_appSettings.data.query_relationships'),
        ct = dmx.parse('sc_appSettings.data.query_contacttypes'),
        ins = dmx.parse('sc_appSettings.data.query_instructors'),
        ab = dmx.parse('sc_appSettings.data.query_absencetypes'),
        clt = dmx.parse('sc_appSettings.data.query_classtypes'),
        s = {},
        mn,
        mx,
        r = false,
        ta = [],
        tra = [],
        to = {},
        da = [],
        cla = {},
        claid = {},
        claa = [],
        instructors = {},
        instructors_array = [],
        ra = {},
        ra2 = [],
        cta = {},
        ct_arr = [],
        ect = [],
        etarr = [],
        etid = {},
        pct = [],
        clt_arr = [],
        clt_id = {},
        abt = [];

    for (i = 0; i < l.length; i++) {
        var n = l[i].name, v = l[i].value;
        s[n] = v;
        // Class Times Generator
        if (n === "class_min_time") { mn = Number(v) };
        if (n === "class_max_time") { mx = Number(v) };
        // Loop & create class times
        if (mn && mx && !r) {
            let idx = 0;
            r = true;
            for (st = mn; st <= mx; st = st + 0.25) {
                var dt = decimalToTime(st,true);
                ta.push({ "display": dt, "decimal": st });
                to[st] = { "display": dt, "decimal": st };
                if((st % 1 === 0 && (st + 1) <= mx) || idx === 0) {
                    tra.push({
                        "decimals": {
                            "startdecimal": st,
                            "enddecimal": Math.floor(st + 1)
                        },
                        "display": `${st % 1 == 0 ? decimalToTime(st) : decimalToTime(st)} - ${decimalToTime(Math.floor((st + 1)),true)}` 
                    })
                }
                // Push range where end decimal isn't on the hour.
                if(mx - st < 1) {
                    tra.push({
                        "decimals": {
                            "startdecimal": Math.floor(st),
                            "enddecimal": mx
                        },
                        "display": `${st % 1 == 0 ? decimalToTime(st) : decimalToTime(st)} - ${decimalToTime(mx,true)}` 
                    });
                    break;
                }
                idx++;
            }
            s["ct_range_array"] = tra;
            s["ct_array"] = ta;
            s["ct_obj"] = to;
        }
        // Durations Generator
        if (n === "class_durations") {
            var d = JSON.parse(v);
            for (j = 0; j < d.length; j++) {
                var tu, dd = d[j];
                dd < 1 ? (tu = " minutes", dd = dd * 60) : dd == 1 ? tu = " hour" : tu = " hours";
                da.push({ "display": dd + tu, "value": d[j] });
            }
            s["duration_array"] = da;
        }

        // Class Range by Hour Generator

    }
    // Levels
    // Levels By Name
    for (let i = 0; i < cl.length; i++) {
        let l = cl[i];
        let n = l.name, c = l.colour, id = l.id, o = l.order, v = l.isValid, t = l.classType, ln = l.longName, sn = l.shortName, tc = l.textcolour;
        cla[n] = { "name": n, "colour": c, "textcolour": tc, "id": id, "order": o, "valid": v, "classType": t, "classType_longName": ln, "classType_shortName": sn };
    }
    s["classLevels"] = cla;

    // Levels by ID
    for (let i = 0; i < cl.length; i++) {
        let l = cl[i];
        let n = l.name, c = l.colour, id = l.uuid, o = l.order, v = l.isValid, t = l.classType, ln = l.longName, sn = l.shortName, tc = l.textcolour;
        claid[id] = { "name": n, "colour": c, "textcolour": tc, "id": id, "order": o, "valid": v, "classType": t, "classType_longName": ln, "classType_shortName": sn };
    }
    s["classLevelsByID"] = claid;
    // Levels Array
    for (let i = 0; i < cl.length; i++) {
        let l = cl[i];
        claa.push(l);
    }
    s['classLevels_array'] = claa;
    // Absence Types / Statuses
    // Array
    for (let i = 0; i < ab.length; i++) {
        abt.push(ab[i]);
    }
    s["absence_status"] = abt;
    // Enrolment Types by Id and Array
    for (let i = 0; i < et.length; i++) {
        let e = et[i];
        etarr.push(e);
        etid[e.id] = { "name": e.type };
    }
    s["enrolTypesById"] = etid;
    s["enrolTypesArray"] = etarr;

    // Class Types / Statuses
    // Array
    for (let i = 0; i < clt.length; i++) {
        let c = clt[i];
        clt_arr.push(c);
        clt_id[c.uuid] = {"long_name": c.longName, "short_name": c.shortName}
    }
    s["classTypes_arr"] = clt_arr;
    s["classTypesById"] = clt_id;

    // Instructors by ID & Array
    for (let i = 0; i < ins.length; i++) {
        let x = ins[i];
        let id = x.uuid, truncn = x.firstName + ' ' + x.lastName.slice(0, 1) + '.', first = x.firstName, last = x.lastName;
        instructors[id] = { "trunc_name": truncn, "firstName": first, "lastName": last, "id": id };
        instructors_array.push({ "trunc_name": truncn, "firstName": first, "lastName": last, "id": id });
    }
    s["instructorsById"] = instructors;
    s["instructors"] = instructors_array;
    // Get Relationships by ID
    for (let i = 0; i < rl.length; i++) {
        let r = rl[i];
        ra[r.id] = { "id": r.id, "name": r.type };
        ra2.push({ "id": r.id, "name": r.type });
    }
    s["relationships"] = ra;
    s["relationships"]['relationshipArray'] = ra2;

    // Get contact types by ID
    for (let i = 0; i < ct.length; i++) {
        let c = ct[i];
        cta[c.id] = { "id": c.id, "type": c.type, "typesmatch": c.typesmatch, "abbr": c.abbr };
        ct_arr.push({ "id": c.id, "type": c.type, "typesmatch": c.typesmatch, "abbr": c.abbr });
        if (c.typesmatch === 'email' || c.typesmatch === 'all') {
            ect.push({ "id": c.id, "type": c.type, "typesmatch": c.typesmatch, "abbr": c.abbr });
        }
        if (c.typesmatch === 'phone' || c.typesmatch === 'all') {
            pct.push({ "id": c.id, "type": c.type, "typesmatch": c.typesmatch, "abbr": c.abbr });
        }
    }
    s["contactTypes"] = cta;
    s["contactTypes"]["contactTypesArray"] = ct_arr;
    s["contactTypes"]["emailContactTypes"] = ect;
    s["contactTypes"]["phoneContactTypes"] = pct;

    // Days array & Object
    s['days_array'] = {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        7: 'Sunday'
    }
    s['days_obj'] = [
        { 'dayint': 1, 'dayname': 'Monday' },
        { 'dayint': 2, 'dayname': 'Tuesday' },
        { 'dayint': 3, 'dayname': 'Wednesday' },
        { 'dayint': 4, 'dayname': 'Thursday' },
        { 'dayint': 5, 'dayname': 'Friday' },
        { 'dayint': 6, 'dayname': 'Saturday' },
        { 'dayint': 7, 'dayname': 'Sunday' }
    ]

    // Notes object
    s['notes'] = {
        1: {
            'priority': 'lowest',
            'bgcolour': '#def7d4',
            'textcolour': '#267306'
        },
        2: {
            'priority': 'low',
            'bgcolour': '#a0e086',
            'textcolour': '#267306'
        },
        3: {
            'priority': 'medium',
            'bgcolour': '#fab733',
            'textcolour': '#2e0802'
        },
        4: {
            'priority': 'high',
            'bgcolour': '#FF4E11',
            'textcolour': '#ffffff'
        },
        5: {
            'priority': 'critical',
            'bgcolour': '#FF0D0D',
            'textcolour': '#ffffff'
        },
    }

    //Set appSettings
    dmx.app.set('appSettings', s);
}

function reloadAppSettingsObject() {
    dmx.parse('sc_appSettings.load({})');
    dmx.app.set('appSettings', null);
    appSettingsObject();
}