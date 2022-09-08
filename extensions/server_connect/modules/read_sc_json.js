const fs = require('fs');

exports.readServerConnect = async function (options) {
    options = this.parse(options);
    let api = options.api.replace('/app/api/','lib/').replace('.json','');

    this.exec(api, true);
}