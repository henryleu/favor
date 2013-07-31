var settings = require('./../settings');
var log4js = require('log4js');
log4js.configure('./lib/logging.json', { reloadSecs: settings.logging.reloadSecs });
var applogger = log4js.getLogger('app');
module.exports = {
    applogger: log4js.connectLogger(applogger, { level: settings.logging.level }),
    logger: applogger
};
