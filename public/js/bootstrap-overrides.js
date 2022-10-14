document.addEventListener('DOMContentLoaded', function () {
    waitfor_el('.offcanvas-backdrop').then((bd) => {
        bd.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
        });
    });
});


document.addEventListener('show.bs.modal', function (event) {
    // debugger;
    let _pdl_uid = Math.random();
    let visible = document.querySelectorAll('.modal.show');
    let offcanvas = event.target.closest('.offcanvas');
    let zIndex = 1055 + (10 * visible.length);
    event.target.setAttribute('pdl-uid', _pdl_uid)
    event.target.style.zIndex = zIndex;
    setTimeout(function () {
        // debugger;
        let n = document.querySelector('.modal-backdrop:not(.modal-stack)');
        n.setAttribute('pdl-uid', _pdl_uid);
        n.style.zIndex = zIndex - 1;
        n.classList.add('modal-stack');
        if (offcanvas !== null) {
            offcanvas.appendChild(n);
        }
        // document.querySelectorAll('.modal-backdrop:not(.modal-stack)').forEach((n) => {
        //     debugger;
        //     n.setAttribute('eventtime', Date());
        //     n.setAttribute('pdl-uid', _pdl_uid);
        //     n.style.zIndex = zIndex - 1;
        //     n.classList.add('modal-stack');
        //     if(offcanvas !== null) {
        //           offcanvas.appendChild(n);
        //       } 
        // });
    }, 10)
});

document.addEventListener('hide.bs.modal', function(event) {
    // debugger;
    let modal_uid = event.target.getAttribute('pdl-uid');
    if(modal_uid !== null) {
        let n = document.querySelector(`.modal-backdrop[pdl-uid="${modal_uid}"`);
        n.classList.remove('modal-stack');
        n.removeAttribute('pdl-uid');
    }
});

document.addEventListener('hidden.bs.modal', function (event) {
    let visible = document.querySelectorAll('.modal.show');
    if (visible.length > 0) {
        setTimeout(function () {
            document.body.classList.add('modal-open');
        });
    }
});

// Modal backdrop to parent;
function modal_parent_backdrop(modalSelector = '.modal.bg-parent', parentSelector) {
    let modal = document.querySelectorAll(modalSelector);
    let parent = document.querySelector(parentSelector);
    modal.forEach(e => {
        e.addEventListener('show.bs.modal', function (ev) {
            waitfor_el('.modal-backdrop').then((elm) => {
                let z = getComputedStyle(parent).zIndex;
                elm.style.zIndex = Number(z) + 1;
                e.style.zIndex = Number(z) + 2;
                // e.classList.add(modalSelector);
                // e.after(elm);
            });
        });
    });
};

// Modal backdrop above offcanvas
function modal_above_oc_backdrop(modalSelector = '.modal.bg-above-oc') {
    let modal = document.querySelectorAll(modalSelector);
    modal.forEach(e => {
        e.addEventListener('show.bs.modal', function (ev) {
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