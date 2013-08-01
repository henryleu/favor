var mongoose = require('mongoose');
var settings = require('./../settings');
var logger = require('./logging').logger;

var makeMongodbUrl = function(mongo){
    var url = 'mongodb://';
    url = url + mongo.host + ':' + mongo.port + '/' + mongo.db;};
mongoose.connect( makeMongodbUrl(settings.mongo) );

mongoose.connection.on('error', function(){
    logger.error('mongodb error hanpens');
});

module.exports.mongoose = mongoose;