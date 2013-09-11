var id = require('../lib/id-generator');

exports.up = function (next) {
    console.info("set up and configure id keys...");
    id.init();
    next();
};

exports.down = function (next) {
    console.info("tear down mysql...");
    next();
};