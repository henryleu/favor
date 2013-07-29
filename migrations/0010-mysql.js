var store = require('../db');

exports.up = function(next){
    console.info("create deals");
  next();
};

exports.down = function(next){
  next();
};
