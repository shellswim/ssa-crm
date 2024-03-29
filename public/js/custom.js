// JavaScript Document
// Find Key in Array of Objects

// Utilities
const isRegExp = (string) => {
    try {
        return new Function(`
            "use strict";
            try {
                new RegExp(${string});
                return true;
            } catch (e) {
                return false;
            }
        `)();
    } catch(e) {
        return false;
    }
};

// Function to add "please select..." before dynamic optgroups -- Must be run from app root finished loading.
function payTypesPsel() {
    let x = document.querySelector('#payTypeSelect'),
        y = document.createElement('option'),
        z = document.querySelector('#optgroup_0');
    if (x) {
        y.text = 'Please select...';
        y.disabled = "true";
        y.selected = "true";
        x.insertBefore(y, z);
    }
}
// Functions to get base values
function baseValues(d, n) {
    dmx.app.set(n, d);
}

// Object path from string
const getpath = (from, ...selectors) => [...selectors].map(s =>
    s
    .replace(/\[([^\[\]]*)\]/g, '.$1.')
    .split('.')
    .filter(t => t !== '')
    .reduce((prev, cur) => prev && prev[cur], from)
);

function addSetKeyedArray(k, v) {
    var a = [];
    dmx.app.set('var_' + k, a[k] = v);
}
//**  Convert decimal to display time. ****
function decimalToTime(number, period = false, shortened = false) {
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
    if (minute.length < 2) {
        minute = '0' + minute;
    }
    // Add Sign in final result
    sign = sign == 1 ? '' : '-';
    // Concate hours and minutes
    if (shortened) {
        time = hour;
    } else {
        time = `${sign + hour + ':' + minute}${period ? ' ' + ampm : ''}`;
    }
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
    e == "open" ? $(".draggable-modal").draggable({
        handle: ".modal-header"
    }) : $(".draggable-modal").css({
        'top': '',
        'left': ''
    });
    $(".modal-header.ui-draggable-handle").mousedown(function () {
        $(this).css({
            cursor: "grabbing"
        })
    }).mouseup(function () {
        $(this).css({
            cursor: "grab"
        })
    });
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
    (function ($) {
        "use strict";

        function _interopDefaultLegacy(e) {
            return e && typeof e === "object" && "default" in e ? e : {
                default: e
            }
        }
        var $__default = _interopDefaultLegacy($);
        var NULL_CELL = new(function () {
            function class_1() {}
            class_1.prototype.columnAddress = function () {
                return 0
            };
            class_1.prototype.width = function () {
                return 0
            };
            class_1.prototype.getCell = function () {
                return null
            };
            class_1.prototype.matches = function (other) {
                return false
            };
            return class_1
        }());
        var RowMerge = function () {
            function RowMerge(tableTarget, args) {
                var t = tableTarget.get(0);
                if (!(t instanceof HTMLTableElement)) {
                    throw new Error("JQuery target must be a table element.")
                }
                this.origTable = t;
                var exc = args.zeroIndexed ? args.excludedColumns : args.excludedColumns.map(function (n) {
                    return n - 1
                });
                this.mergeTable = RowMerge.merge(t, args.matcher, exc)
            }
            RowMerge.merge = function (table, matcher, excludedColumns) {
                var t = table.cloneNode(true);
                var s = t.tBodies;
                for (var i = 0; i < s.length; i++) {
                    var section = s.item(i);
                    RowMerge.mergeSection(section, matcher, excludedColumns)
                }
                return t
            };
            RowMerge.mergeSection = function (section, matcher, excludedColumns) {
                var rows = section.rows;
                if (rows.length == 0) {
                    return
                }
                var arr = new Array;
                arr.push(NULL_CELL);
                for (var r = 0; r < rows.length; r++) {
                    var row = rows.item(r);
                    var cells = RowMerge.createCells(row.cells, matcher);
                    if (cells.length == 0) {
                        continue
                    }
                    var ia = 0;
                    var ib = 0;
                    var arrNew = new Array;
                    var _loop_1 = function () {
                        var cellA = arr[ia];
                        var cellB = cells[ib];
                        var ca = cellA.columnAddress();
                        var cb = cellB.columnAddress();
                        if (ca > cb) {
                            ib++;
                            arrNew.push(cellB)
                        } else if (ca < cb) {
                            ia++
                        } else {
                            if (excludedColumns.some(function (n) {
                                    return ca === n
                                })) {
                                ia++;
                                ib++;
                                arrNew.push(cellB)
                            } else {
                                var wa = cellA.width();
                                var wb = cellB.width();
                                if (wa != wb) {
                                    ia++;
                                    ib++;
                                    arrNew.push(cellB)
                                } else {
                                    if (cellA.matches(cellB)) {
                                        arrNew.push(cellA);
                                        cellA.getCell().rowSpan++;
                                        row.removeChild(cellB.getCell());
                                        ia++;
                                        ib++
                                    } else {
                                        ia++;
                                        ib++;
                                        arrNew.push(cellB)
                                    }
                                }
                            }
                        }
                    };
                    while (ia < arr.length && ib < cells.length) {
                        _loop_1()
                    }
                    for (; ib < cells.length; ib++) {
                        var cellB = cells[ib];
                        arrNew.push(cellB)
                    }
                    arr = arrNew
                }
            };
            RowMerge.createCells = function (cells, matcher) {
                var a = new Array(cells.length);
                for (var i = 0, col = 0; i < cells.length; i++) {
                    var c = cells.item(i);
                    var width = c.colSpan;
                    a[i] = new RowMerge.SingleCell(col, width, c, matcher);
                    col += width
                }
                return a
            };
            RowMerge.prototype.getMerged = function () {
                return this.mergeTable
            };
            RowMerge.prototype.getOriginal = function () {
                return this.origTable
            };
            RowMerge.SingleCell = function () {
                function class_2(column, width, cell, matcher) {
                    this.col = column;
                    this.w = width;
                    this.cell = cell;
                    this.matcher = matcher
                }
                class_2.prototype.columnAddress = function () {
                    return this.col
                };
                class_2.prototype.width = function () {
                    return this.w
                };
                class_2.prototype.getCell = function () {
                    return this.cell
                };
                class_2.prototype.matches = function (other) {
                    return this.matcher(this.getCell(), other.getCell())
                };
                return class_2
            }();
            return RowMerge
        }();
        $__default["default"].fn.rowMerge = function (args) {
            var MATCH_TEXT_ONLY = function (value, other) {
                return value.textContent == other.textContent
            };
            var target = this;
            args = $__default["default"].extend({}, $__default["default"].fn.rowMerge.args, args);
            if (typeof args.matcher === "undefined") args.matcher = MATCH_TEXT_ONLY;
            if (typeof args.excludedColumns === "undefined") args.excludedColumns = new Array;
            if (typeof args.zeroIndexed === "undefined") args.zeroIndexed = false;
            var rowMerge = new RowMerge(target, args);
            var methods = {
                merge: function () {
                    update(rowMerge.getMerged())
                },
                unmerge: function () {
                    update(rowMerge.getOriginal())
                }
            };
            methods.merge();
            return methods;

            function update(table) {
                var t = $__default["default"](table);
                target.replaceWith(t);
                target = t
            }
        };
        $__default["default"](function () {
            var selector = typeof $__default["default"].fn.rowMerge.selector === "undefined" ? "table.row-merge" : $__default["default"].fn.rowMerge.selector;
            var s = $__default["default"](selector);
            s.each(function (i, e) {
                $__default["default"](e).rowMerge()
            })
        });
        $__default["default"].fn.rowMerge.selector = undefined;
        $__default["default"].fn.rowMerge.args = {}
    })($);
}
// Init mergeTable function then call on table.
function initMergeTable(el, exclude) {
    let tables = document.querySelectorAll(el);
    for (let i = 0; i < tables.length; i++) {
        let table = tables[i];
        let clone = table.cloneNode(true);
        let parent = table.parentNode;

        // prep clone for insertion
        clone.classList.add(`clone-table-${i}`);
        clone.classList.remove('d-none');
        parent.insertBefore(clone, table);

        mergeTable();
        init(i, exclude);
    }

    function init(i, exclude) {
        if (!Array.isArray.exclude) {
            exclude = exclude.split(',');
        }
        var ctable = $(`.clone-table-${i}`).rowMerge({
            excludedColumns: exclude,
        });
        try {
            ctable.merge();
        } catch (err) {
            console.error(err);
        }
    }

}

function removeMergeTable() {
    let allEls = document.querySelectorAll('[class^="clone-table"]');
    for (e of allEls) {
        e.remove();
    }
}

function openFile(url) {
    console.log(url);
    window.open(url, '_blank').focus();
}

function clearformdata(element) {
    let getform = findPropPaths(dmx.app.data, key => key === element)[0] + '.data';
    if (getform.length > 0) {
        function setToValue(obj, value, path) {
            path = path.split('.');
            for (i = 0; i < path.length - 1; i++)
                obj = obj[path[i]];
            obj[path[i]] = value;
        }
        setToValue(dmx.app.data, null, getform);
    }
}

// Reset Google Places Autocomplete Input
function gpReset(p) {
    let path = dmx.parse('content.' + p);
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
dmx.rules.max.validity = function (element, param) {
    if (element.type == 'date') {
        return element.value <= param;
    }

    return +element.value <= +param;
}
dmx.rules.min.validity = function (element, param) {
    if (element.type == 'date') {
        return element.value <= param;
    }

    return +element.value <= +param;
}
// DMX Formatters
dmx.Formatter('object', 'stringify', function (val) {
    return JSON.stringify(val);
});
dmx.Formatter('string', 'unstringify', function (val) {
    let parsed = JSON.parse(val);
    return parsed;
});
dmx.Formatter('array', 'sortarray', function (arr, stringified, path) {
    // sort arrays as numbers
    if (stringified) {
        arr = arr.map(e => {
            return JSON.parse(e);
        });
    }
    if (path) {
        arr.sort(function (a, b) {
            let apath = getpath(a, path);
            let bpath = getpath(b, path);
            return apath - bpath
        });
    } else {
        arr.sort(function (a, b) {
            return a - b
        });
    }
    if (stringified) {
        arr = arr.map(e => {
            return JSON.stringify(e);
        })
    }
    return arr;
});



function findPropPaths(obj, predicate) { // The function 
    const discoveredObjects = []; // For checking for cyclic object
    const path = []; // The current path being searched
    const results = []; // The array of paths that satify the predicate === true
    if (!obj && (typeof obj !== "object" || Array.isArray(obj))) {
        throw new TypeError("First argument of finPropPath is not the correct type Object");
    }
    if (typeof predicate !== "function") {
        throw new TypeError("Predicate is not a function");
    }
    (function find(obj) {
        for (const key of Object.keys(obj)) { // use only enumrable own properties.
            if (predicate(key, path, obj) === true) { // Found a path
                path.push(key); // push the key
                results.push(path.join(".")); // Add the found path to results
                path.pop(); // remove the key.
            }
            const o = obj[key]; // The next object to be searched
            if (o && typeof o === "object" && !Array.isArray(o)) { // check for null then type object
                if (!discoveredObjects.find(obj => obj === o)) { // check for cyclic link
                    path.push(key);
                    discoveredObjects.push(o);
                    find(o);
                    path.pop();
                }
            }
        }
    }(obj));
    return results;
}

function consolelog(message) {
    console.log(message);
}

// TinyMCE Bootstrap Dialog/Modal fix.
// Prevent Bootstrap dialog from blocking focusin
document.addEventListener('focusin', (e) => {
    if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
        e.stopImmediatePropagation();
    }
});

function setpagetitle(pagetitle) {
    document.title = pagetitle + ' - Puddle CRM';
}

// Before unload events
function beforeunload(e) {
    e.preventDefault();
    return e.returnValue = returnvalue;
}

function beforeunloadlistener(returnvalue = "Are you sure you want to exit?") {
    window.addEventListener('beforeunload', beforeunload);
}

function removebeforeunload() {
    window.removeEventListener('beforeunload', beforeunload, false);
}

// Input key restrictions
function restrictCharacters() {
    let els = document.querySelectorAll('[character-restrict]');
    for(let i=0;i<els.length;i++){
        el = els[i];
        let regex;
        regex_bool = el.getAttribute('is-regex') == "true" ? true : false;
        regex_bool == true ? regex = new RegExp(el.getAttribute('character-restrict').replace('/',''),'g') : regex = el.getAttribute('character-restrict');
        el.addEventListener('beforeinput', (e) => {
            if(regex_bool) {
                console.log(regex);
                if(e.data && regex.test(e.data)){
                    console.log('stopping input')
                    e.preventDefault();
                    return;
                } else {
                    console.log('Didn\'t Work!')
                }
            } else {
                let str = regex.split(',');
                for(let i=0;i<str.length;i++) {
                    if (!e.data.match(str[i])) {
                        e.preventDefault();
                    }
                }
            }
        }, true)
    }
}