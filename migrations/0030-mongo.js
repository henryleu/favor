var store = require('../lib/db');

exports.up = function(next){
    console.info("set up and configure mongodb...");
    next();
};

exports.down = function(next){
    console.info("tear down mongodb...");
    next();
};
