document.addEventListener('DOMContentLoaded', function() {
    waitfor_el('.offcanvas-backdrop').then((bd)=>{
        bd.addEventListener('click', (e)=>{
            e.stopPropagation();
        });
    });
});

// Modal backdrop to parent;
function modal_parent_backdrop(modalSelector) {
    let modal = modalSelector ? document.querySelectorAll(modalSelector) : document.querySelectorAll('.modal.bg-parent');
    modal.forEach(e => {
        e.addEventListener('show.bs.modal', function(ev) {
            waitfor_el('.modal-backdrop').then((elm) => {
                e.after(elm);
            });
        });
    });
};

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

