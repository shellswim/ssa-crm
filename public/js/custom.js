// JavaScript Document
// Find Key in Array of Objects

function appSettingsObject() {
    var l = dmx.parse('appSettings.data.getSettings'),
        cl = dmx.parse('getLevels.data.query'),
        et = dmx.parse('enrolmentTypes.data.query'),
        rl = dmx.parse('getRelationships.data.query'),
        ct = dmx.parse('getContactTypes.data.contactTypes'),
        ins = dmx.parse('getAllStaff.data.instructors.getInstructors'),
        s = {},
        mn,
        mx,
        r = false,
        ta = [],
        to = {},
        da = [],
        cla = {},
        claid = {},
        instructors = {},
        instructors_array = [],
        ra = {},
        ra2 = [],
        cta = {},
        ct_arr = [],
        ect = [],
        etarr = [],
        etid = {},
        pct = [];

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
        let n = l.name, c = l.colour, id = l.id, o = l.order, v = l.isValid, t = l.classType, ln = l.longName, sn = l.shortName, tc = l.textcolour;
        claid[id] = { "name": n, "colour": c, "textcolour": tc, "id": id, "order": o, "valid": v, "classType": t, "classType_longName": ln, "classType_shortName": sn };
    }
    s["classLevelsByID"] = claid;
    // Enrolment Types by Id and Array
    for(let i=0;i<et.length;i++) {
        let e = et[i];
        etarr.push(e);
        etid[e.id] = {"name": e.type};
    }
    s["enrolTypesById"] = etid;
    s["enrolTypesArray"] = etarr;

    // Instructors by ID & Array
    for (let i = 0; i < ins.length; i++) {
        let x = ins[i];
        let id = x.id, truncn = x.firstName + ' ' + x.lastName.slice(0, 1) + '.', first = x.firstName, last = x.lastName;
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
        {'dayint':1, 'dayname': 'Sunday'},
        {'dayint':2, 'dayname': 'Monday'},
        {'dayint':3, 'dayname': 'Tuesday'},
        {'dayint':4, 'dayname': 'Wednesday'},
        {'dayint':5, 'dayname': 'Thursday'},
        {'dayint':6, 'dayname': 'Friday'},
        {'dayint':7, 'dayname': 'Saturday'}
    ]
    //Set appSettings
    dmx.app.set('appSettings', s);
}

// Function to add "please select..." before dynamic optgroups -- Must be run from app root finished loading.
function payTypesPsel() {
    let x = document.querySelector('#payTypeSelect'), y = document.createElement('option'), z = document.querySelector('#optgroup_0');
    if (x) {
        y.text = 'Please select...'; y.disabled = "true"; y.selected = "true";
        x.insertBefore(y, z);
    }
}
// Functions to get base values
function baseValues(d, n) {
    dmx.app.set(n, d);
}


function addSetKeyedArray(k, v) {
    var a = [];
    dmx.app.set('var_' + k, a[k] = v);
}
//**  Convert decimal to display time. ****
function decimalToTime(number) {
    // Check sign of given number
    var sign = (number >= 0) ? 1 : -1;
    var ampm = number < 12 ? "AM" : "PM";
    // Set positive value of number of sign negative
    number = number * sign;
    // Separate the int from the decimal part
    var hour = Math.floor(number);
    var decpart = number - hour;
    hour = Math.floor(number) > 12 ? Math.floor(number) - 12 : hour == 0 ? hour = 12 : hour;
    var min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);
    var minute = Math.floor(decpart * 60) + '';
    // Add padding if need
    if (minute.length < 2) { minute = '0' + minute; }
    // Add Sign in final result
    sign = sign == 1 ? '' : '-';
    // Concate hours and minutes
    time = sign + hour + ':' + minute + " " + ampm;
    return time;
}

function selectedTimeToDisplay(v) {
    dmx.app.set('testTimeDisplaySet', decimalToTime(v));
    return decimalToTime(v);
}

function classDurations(v) {
    var tu;
    v < 1 ? (tu = " minutes", v * 60) : v == 1 ? tu = " hour" : tu = " hours";
    return v + tu;
    // da.push({ "display": dd + tu, "value": d[j] });
}

// Draggable Modal
function addDraggable(e) {
    e == "open" ? $(".draggable-modal").draggable({ handle: ".modal-header" }) : $(".draggable-modal").css({ 'top': '', 'left': '' });
    $(".modal-header.ui-draggable-handle").mousedown(function () { $(this).css({ cursor: "grabbing" }) }).mouseup(function () { $(this).css({ cursor: "grab" }) });
}

// Disable Dynamic Options
function optionDisable(sel, arr, dir) {
    var opt = Array.from(document.querySelector(sel).options);
    if (dir == "disable") {
        for (i = 0; i < opt.length; i++) {
            var copt = opt[i];
            arr.some(item => item.id == copt.value) ? copt.disabled = true : copt.disabled = false;
        }
    } else if (dir == "all") {
        for (i = 0; i < opt.length; i++) {
            var copt = opt[i];
            copt.disabled = false;
        }
    } else {
        for (i = 0; i < opt.length; i++) {
            var copt = opt[i];
            if (copt.value == arr) {
                copt.disabled = false;
                break;
            }
        }
    }
    // for (i = 0; i < opt.length; i++) {
    //     var copt = opt[i];
    //     if (dir == "disable") {
    //         arr.some(item => item.id == copt.value) ? copt.disabled = true : copt.disabled = false;
    //     } else if (dir == "all") {
    //         copt.disabled = false;
    //     }
    //     else {
    //         if (copt.value == arr) {
    //             copt.disabled = false;
    //             break;
    //         }
    //     }
    // }

}
function fulltextConvert(w) {
    var text1 = w.split(" ").map(i => i = "'" + i + "*'").join(' ');
    var text2 = "\"" + w + "\"";
    return text1 + ' ' + text2;
}

// Get selected index text from Select Element
function getSelectText(sel) {
    e = document.querySelector(sel);
    return t = e.options[e.selectedIndex].text;
}

// Fix Offcanvas Close on Click
function offCanvasNoClose() {
    document.querySelector('body.offcanvas-backdrop').addEventListener('click', function (e) {
        e.stopPropagation();
    })
};

// Rowmerge ///////////////////////////////////////////////////////
// USE TO MERGE TABLE ROWS WITH SAME INFORMATION FOR EASIER READING
function mergeTable() {
    (function ($) { "use strict"; function _interopDefaultLegacy(e) { return e && typeof e === "object" && "default" in e ? e : { default: e } } var $__default = _interopDefaultLegacy($); var NULL_CELL = new (function () { function class_1() { } class_1.prototype.columnAddress = function () { return 0 }; class_1.prototype.width = function () { return 0 }; class_1.prototype.getCell = function () { return null }; class_1.prototype.matches = function (other) { return false }; return class_1 }()); var RowMerge = function () { function RowMerge(tableTarget, args) { var t = tableTarget.get(0); if (!(t instanceof HTMLTableElement)) { throw new Error("JQuery target must be a table element.") } this.origTable = t; var exc = args.zeroIndexed ? args.excludedColumns : args.excludedColumns.map(function (n) { return n - 1 }); this.mergeTable = RowMerge.merge(t, args.matcher, exc) } RowMerge.merge = function (table, matcher, excludedColumns) { var t = table.cloneNode(true); var s = t.tBodies; for (var i = 0; i < s.length; i++) { var section = s.item(i); RowMerge.mergeSection(section, matcher, excludedColumns) } return t }; RowMerge.mergeSection = function (section, matcher, excludedColumns) { var rows = section.rows; if (rows.length == 0) { return } var arr = new Array; arr.push(NULL_CELL); for (var r = 0; r < rows.length; r++) { var row = rows.item(r); var cells = RowMerge.createCells(row.cells, matcher); if (cells.length == 0) { continue } var ia = 0; var ib = 0; var arrNew = new Array; var _loop_1 = function () { var cellA = arr[ia]; var cellB = cells[ib]; var ca = cellA.columnAddress(); var cb = cellB.columnAddress(); if (ca > cb) { ib++; arrNew.push(cellB) } else if (ca < cb) { ia++ } else { if (excludedColumns.some(function (n) { return ca === n })) { ia++; ib++; arrNew.push(cellB) } else { var wa = cellA.width(); var wb = cellB.width(); if (wa != wb) { ia++; ib++; arrNew.push(cellB) } else { if (cellA.matches(cellB)) { arrNew.push(cellA); cellA.getCell().rowSpan++; row.removeChild(cellB.getCell()); ia++; ib++ } else { ia++; ib++; arrNew.push(cellB) } } } } }; while (ia < arr.length && ib < cells.length) { _loop_1() } for (; ib < cells.length; ib++) { var cellB = cells[ib]; arrNew.push(cellB) } arr = arrNew } }; RowMerge.createCells = function (cells, matcher) { var a = new Array(cells.length); for (var i = 0, col = 0; i < cells.length; i++) { var c = cells.item(i); var width = c.colSpan; a[i] = new RowMerge.SingleCell(col, width, c, matcher); col += width } return a }; RowMerge.prototype.getMerged = function () { return this.mergeTable }; RowMerge.prototype.getOriginal = function () { return this.origTable }; RowMerge.SingleCell = function () { function class_2(column, width, cell, matcher) { this.col = column; this.w = width; this.cell = cell; this.matcher = matcher } class_2.prototype.columnAddress = function () { return this.col }; class_2.prototype.width = function () { return this.w }; class_2.prototype.getCell = function () { return this.cell }; class_2.prototype.matches = function (other) { return this.matcher(this.getCell(), other.getCell()) }; return class_2 }(); return RowMerge }(); $__default["default"].fn.rowMerge = function (args) { var MATCH_TEXT_ONLY = function (value, other) { return value.textContent == other.textContent }; var target = this; args = $__default["default"].extend({}, $__default["default"].fn.rowMerge.args, args); if (typeof args.matcher === "undefined") args.matcher = MATCH_TEXT_ONLY; if (typeof args.excludedColumns === "undefined") args.excludedColumns = new Array; if (typeof args.zeroIndexed === "undefined") args.zeroIndexed = false; var rowMerge = new RowMerge(target, args); var methods = { merge: function () { update(rowMerge.getMerged()) }, unmerge: function () { update(rowMerge.getOriginal()) } }; methods.merge(); return methods; function update(table) { var t = $__default["default"](table); target.replaceWith(t); target = t } }; $__default["default"](function () { var selector = typeof $__default["default"].fn.rowMerge.selector === "undefined" ? "table.row-merge" : $__default["default"].fn.rowMerge.selector; var s = $__default["default"](selector); s.each(function (i, e) { $__default["default"](e).rowMerge() }) }); $__default["default"].fn.rowMerge.selector = undefined; $__default["default"].fn.rowMerge.args = {} })($);
}
// Init mergeTable function then call on table.
function initMergeTable(el, exclude) {
    let table = document.querySelector(el);
    let clone = table.cloneNode(true);
    let parent = table.parentNode;

    // prep clone for insertion
    clone.classList.add('clone-table');
    clone.classList.remove('visually-hidden');
    parent.insertBefore(clone, table);

    mergeTable();
    init();

    function init() {
        var ctable = $('.clone-table').rowMerge({
            excludedColumns: exclude.split(','),
        });
        try {
            ctable.merge();
        } catch (err) {
            console.error(err);
        }
    }

}
function removeMergeTable() {
    let allEls = document.querySelectorAll('.clone-table');
    for (e of allEls) {
        e.remove();
    }
}
function openFile(url) {
    console.log(url);
    window.open(url, '_blank').focus();
}

// Reset Google Places Autocomplete Input
function gpReset(p) {
    let path = dmx.parse('content.' + p);
    console.log(path);
    for (const item in path) {
        if (item.startsWith('__') || item.startsWith('$')) {
            continue;
        }
        switch (typeof path[item]) {
            case 'object':
                path[item] = null;
                continue;
            case 'boolean':
                path[item] = false;
                continue;
            case 'string':
                path[item] = '';
                continue;
        }
    }
}

// Override DMX Date Validator
dmx.rules.max.validity = function(element, param) {
    if (element.type == 'date') {
      return element.value <= param;
    }
  
    return +element.value <= +param;
  }
dmx.rules.min.validity = function(element, param) {
    if (element.type == 'date') {
      return element.value <= param;
    }
  
    return +element.value <= +param;
  }