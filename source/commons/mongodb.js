var settings = require('./../../settings').mongo;
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var mongodb = new Db(
    settings.db,
    new Server(
        settings.host,
        settings.port,
        {auto_reconnect: true, poolSize:2}
    ),
    {w: 1} //TODO: need options
);

module.exports = mongodb;