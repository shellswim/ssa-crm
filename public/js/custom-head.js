// Bootstrap Deeplinking
function tabDeeplink(url, defaulthash) {
    // Deeplinking bootstrap tabs
    // let url = location.href.replace(/\/$/, '');
    // if (location.hash) {
        if(!location.hash) url = url.concat('#',defaulthash);
        let hash = url.split('#');
        // if(!hash[1]) hash.splice(1,0,'guardians');
        const currentTab = document.querySelector('#navtabs_parent a[href="#' + hash[1] + '"]');
        const currentTabTarget = currentTab.getAttribute('data-bs-target');
        const currentTabPane = document.querySelector(currentTabTarget);
        currentTab.classList.add('active');
        currentTabPane.classList.add('active','show');
        const curTab = new bootstrap.Tab(currentTab);
        curTab.show();
        url = location.href.replace(/\/#/, '#');
        history.replaceState(null, null, url);
        setTimeout(() => {
            window.scrollTop = 0;
        }, 400);
    // }
    // change url based on selected tab
    const selectableTabList = [].slice.call(document.querySelectorAll('a[data-bs-toggle="tab"]'));
    selectableTabList.forEach((selectableTab) => {
        const selTab = new bootstrap.Tab(selectableTab);
        selectableTab.addEventListener('click', function () {
            var newUrl;
            const hash = selectableTab.getAttribute('href');
            if (hash == '#home-tab') {
                newUrl = url.split('#')[0];
            } else {
                newUrl = url.split('#')[0] + hash;
            }
            history.replaceState(null, null, newUrl);
        });
    });
}