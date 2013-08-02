var mongoose = require('mongoose');
var settings = require('./../settings');
var logger = require('./logging').logger;

var makeMongodbUrl = function(mongo){
    var url = 'mongodb://';
    url = url + mongo.host + ':' + mongo.port + '/' + mongo.db;
    logger.info('connect to ' + url);
    return url;
};
mongoose.connect( makeMongodbUrl(settings.mongo) );
mongoose.connection.on('error', function(err){
    logger.error('mongodb error hanpens:' + err);
});

module.exports = mongoose;