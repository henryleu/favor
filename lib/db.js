var settings = require('./../settings');
var logger = require('./logging').logger;
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var mongodb = new Db(
    settings.mongo.db,
    new Server(
        settings.mongo.host,
        settings.mongo.port,
        {auto_reconnect: true, poolSize:2}
    ),
    {w: 1}); //TODO: need options

var redis = require("redis");
var redisClient = redis.createClient(settings.redis.port, settings.redis.host, {} ); //TODO: need options
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
        logger.info(msg, arguments);
    }
};

redisClient.on('connect'     , infolog('Redis is connecting'));
redisClient.on('ready'       , infolog('Redis is ready'));
redisClient.on('reconnecting', warnlog('Redis is reconnecting'));
redisClient.on('error'       , errorlog('Redis error happens'));
redisClient.on('end'         , infolog('Redis is ended'));

module.exports = {
    mongodb: mongodb,
    redis: redisClient
};
