function appSettingsObject() {
    var l = dmx.parse('appSettings.data.getSettings'),
        cl = dmx.parse('appSettings.data.query_levels'),
        et = dmx.parse('appSettings.data.query_enroltypes'),
        rl = dmx.parse('appSettings.data.query_relationships'),
        ct = dmx.parse('appSettings.data.query_contacttypes'),
        ins = dmx.parse('appSettings.data.query_instructors'),
        ab = dmx.parse('appSettings.data.absence_types'),
        s = {},
        mn,
        mx,
        r = false,
        ta = [],
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
        pct = []
        abt = [];

    for (i = 0; i < l.length; i++) {
        var n = l[i].name, v = l[i].value;
        s[n] = v;
        // Class Times Generator
        if (n === "class_min_time") { mn = Number(v) };
        if (n === "class_max_time") { mx = Number(v) };
        // Loop & create class times
        if (mn && mx && !r) {
            r = true;
            for (st = mn; st <= mx; st = st + 0.25) {
                var dt = decimalToTime(st);
                ta.push({ "display": dt, "decimal": st });
                to[st] = { "display": dt, "decimal": st };
            }
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
        1: 'Sunday',
        2: 'Monday',
        3: 'Tuesday',
        4: 'Wednesday',
        5: 'Thursday',
        6: 'Friday',
        7: 'Saturday'
    }
    s['days_obj'] = [
        { 'dayint': 1, 'dayname': 'Sunday' },
        { 'dayint': 2, 'dayname': 'Monday' },
        { 'dayint': 3, 'dayname': 'Tuesday' },
        { 'dayint': 4, 'dayname': 'Wednesday' },
        { 'dayint': 5, 'dayname': 'Thursday' },
        { 'dayint': 6, 'dayname': 'Friday' },
        { 'dayint': 7, 'dayname': 'Saturday' }
    ]

    //Set appSettings
    dmx.app.set('appSettings', s);
}