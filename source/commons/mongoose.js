var mongoose = require('mongoose');
var settings = require('./../../settings');
var logger = require('./logging').logger;

var makeUrl = function(mongo){
    return 'mongodb://' + mongo.host + ':' + mongo.port + '/' + mongo.db;
};

var url = makeUrl(settings.mongo);
mongoose.connect(url, {}, function(err){
    logger.info('mongoose is connected to ' + url);
});
mongoose.connection.on('error', function(err){
    logger.error('mongoose error happens:' + err);
});

module.exports = mongoose;