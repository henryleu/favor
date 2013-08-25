var logger = require('./logging').logger;
var generate = function(key){
    var id = new Date().getTime();
    logger.debug('new ' + key + ' id: ' + id);
    return id;
};
module.exports = generate;