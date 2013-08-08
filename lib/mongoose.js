var mongoose = require('mongoose');
var settings = require('./../settings');
var logger = require('./logging').logger;

var makeUrl = function(mongo){
    return 'mongodb://' + mongo.host + ':' + mongo.port + '/' + mongo.db;
};

var url = makeUrl(settings.mongo);
mongoose.connect(url);
logger.info('mongoose is connected to ' + url);
mongoose.connection.on('error', function(err){
    logger.error('mongoose error hanpens:' + err);
});

module.exports = mongoose;