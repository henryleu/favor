var settings = require('./../../settings').redis;
var logger = require('./logging').logger;
var redis = require("redis");
var redisClient = redis.createClient(settings.port, settings.host, {} ); //TODO: need options
var infolog = function (msg) {
    return function() {
        logger.info(msg, arguments);
    }
};
var warnlog = function (msg) {
    return function() {
        logger.warn(msg, arguments);
    }
};
var errorlog = function (msg) {
    return function() {
        logger.error(msg, arguments);
    }
};

redisClient.on('connect'     , infolog('Redis is connecting'));
redisClient.on('ready'       , infolog('Redis is ready'));
redisClient.on('reconnecting', warnlog('Redis is reconnecting'));
redisClient.on('error'       , errorlog('Redis error happens'));
redisClient.on('end'         , infolog('Redis is ended'));

module.exports = redisClient;
