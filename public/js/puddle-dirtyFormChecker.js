const pddfc = function pd_dirtyFormChecker(input) {
    input = input.currentTarget;
    let fid = dmx.app.data.g_formid;
    let dfc = dmx.app.data.pd_dirtyFormCheck[fid]['els'];
    let dfcc = dmx.app.data.pd_dirtyFormCheck[fid]['els_changed'];
    dmx.app.data.pd_dirtyFormCheck[fid]['els_changed'][input.getAttribute('pddfc')] = input.value;
    for(let i=0;i<dfc.length;i++) {
        if(dfc[i] != dfcc[i]) {
            dmx.app.data.pd_dirtyFormCheck[fid].dirty = true;
            break;
         } else {
            dmx.app.data.pd_dirtyFormCheck[fid].dirty = false;
            continue;
         }
    }
}
function pd_dirtyFormCheck_init(formid) {
    let el = document.getElementById(formid).elements;
    dmx.app.data.g_formid = formid;
    const formel = ['input', 'select', 'textarea'];
    dmx.app.data.pd_dirtyFormCheck = {};
    dmx.app.data.pd_dirtyFormCheck[formid] = {
        'dirty': false,
        'els': [],
        'els_changed': [],
        'eventlisteners': []
    };
    let dfc = dmx.app.data.pd_dirtyFormCheck[formid].els, dfcc = dmx.app.data.pd_dirtyFormCheck[formid].els_changed;
    let count = 0;
    for(let i=0;i<el.length;i++) {
        let e = el[i];
        if(formel.includes(e.nodeName.toLowerCase())) {
            dfc.push(e.value || null);
            dmx.app.data.pd_dirtyFormCheck[formid].eventlisteners.push(e);
            e.setAttribute('pddfc', count);
            e.addEventListener('input',pddfc);
            count += 1;
        }
    }
    dfcc.push(...dfc);
}
function pd_dirtyFormCheck_destroy() {
    let dfd = dmx.app.data.pd_dirtyFormCheck[dmx.app.data.g_formid];
    for(const el of dfd.eventlisteners) {
        el.removeEventListener('input', pddfc);
        el.removeAttribute('pddfc');
    }
    delete dmx.app.data.pd_dirtyFormCheck[dmx.app.data.g_formid];
    delete dmx.app.data.g_formid;
}
// const pddfc = function pd_dirtyFormChecker(input) {
//     input = input.currentTarget;
//     let dfc = globalThis.pd_dirtyFormCheck[globalThis.g_formid]['els'];
//     let dfcc = globalThis.pd_dirtyFormCheck[globalThis.g_formid]['els_changed'];
//     globalThis.pd_dirtyFormCheck[globalThis.g_formid]['els_changed'][input.getAttribute('pddfc')] = input.value;
//     let c = [];
//     for(let i=0;i<dfc.length;i++) {
//         dfc[i] !== dfcc[i] ? c.push(false) : c.push(true);
//     }
//     c.includes(false) ? globalThis.pd_dirtyFormCheck[globalThis.g_formid].dirty = true : globalThis.pd_dirtyFormCheck[globalThis.g_formid].dirty = false;
// }
// function pd_dirtyFormCheck_init(formid) {
//     let el = document.getElementById(formid).elements;
//     globalThis.g_formid = formid;
//     const formel = ['input', 'select', 'textarea'];
//     globalThis.pd_dirtyFormCheck = {};
//     globalThis.pd_dirtyFormCheck[formid] = {
//         'dirty': false,
//         'els': [],
//         'els_changed': [],
//         'eventlisteners': []
//     };
//     let dfc = globalThis.pd_dirtyFormCheck[formid].els, dfcc = globalThis.pd_dirtyFormCheck[formid].els_changed;
//     let count = 0;
//     for(let i=0;i<el.length;i++) {
//         let e = el[i];
//         if(formel.includes(e.nodeName.toLowerCase())) {
//             dfc.push(e.value || null);
//             pd_dirtyFormCheck[formid].eventlisteners.push(e);
//             e.setAttribute('pddfc', count);
//             e.addEventListener('change',pddfc);
//             count += 1;
//         }
//     }
//     dfcc.push(...dfc);
// }
// function pd_dirtyFormCheck_destroy() {
//     let dfd = globalThis.pd_dirtyFormCheck[globalThis.g_formid];
//     for(const el of dfd.eventlisteners) {
//         el.removeEventListener('change', pddfc);
//         el.removeAttribute('pddfc');
//     }
//     delete globalThis.pd_dirtyFormCheck[globalThis.g_formid];
//     delete globalThis.g_formid;
// }