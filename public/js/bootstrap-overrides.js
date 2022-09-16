document.addEventListener('DOMContentLoaded', function() {
    waitfor_el('.offcanvas-backdrop').then((bd)=>{
        bd.addEventListener('click', (e)=>{
            e.stopPropagation();
        });
    });
});

// Modal backdrop to parent;
function modal_parent_backdrop(modalSelector = '.modal.bg-parent') {
    let modal = document.querySelectorAll(modalSelector);
    modal.forEach(e => {
        e.addEventListener('show.bs.modal', function(ev) {
            waitfor_el('.modal-backdrop').then((elm) => {
                e.after(elm);
            });
        });
    });
};

// Modal backdrop above offcanvas
function modal_above_oc_backdrop(modalSelector = '.modal.bg-above-oc') {
    let modal = document.querySelectorAll(modalSelector);
    modal.forEach(e => {
        e.addEventListener('show.bs.modal', function(ev) {
            waitfor_el('.modal-backdrop').then((elm) => {
                elm.style.zIndex = 1051;
            });
        });
    });
} 

// Utilities
// Wait for element;
function waitfor_el(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

