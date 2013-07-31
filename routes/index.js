var store = require('../lib/db');
var logger = require('../lib/logging').logger;
var util = require('../lib/util');
var redis = store.redis;
var mongodb = store.mongodb;

//Start of temp part for store deal post info to mongodb
var settings = require('../settings');
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + settings.mongo.host + ':' + settings.mongo.port + '/' + settings.mongo.db + '?auto_reconnect=true&poolSize=2');
var Schema = mongoose.Schema;
var dealSchema = new Schema({
    id : String,
    mv : { type: Number, default: 0 },
    dv : { type: Number, default: 0 },
    image : String,
    images : [String],
    dUrl: { type: String, default: '' },
    dSite: { type: String, default: '' },
    sDesc: { type: String, default: '' },
    pSum: { type: String, default: '' },
    lDesc: { type: String, default: '' },
    views : { type: Number, default: 0 },
    likes : { type: Number, default: 0 },
    owns : { type: Number, default: 0 },
    deals : { type: Number, default: 0 },
    reporter : {
        id: String,
        name: String,
        img: String
    }
});
var DealModel = mongoose.model('Deal', dealSchema);
//End of temp part for store deal post info to mongodb

module.exports = function(app) {
    var checkUserToken = function(req, res, next) {
        var userToken = req.cookies.userToken;
        if(userToken){
            logger.info('uid: ' + userToken);
        }
        else{
            userToken = new Date().getTime();
            res.cookie('userToken', userToken);
        }
    };
    //app.all('*', checkUserToken);
    app.get('/', function(req, res) {
        checkUserToken(req, res);
/*
        redis.set("test", "Hello World", function (err, reply) {
            if(err){
                logger.error(err);
            }
            logger.debug(reply);
        });
        redis.get("test", function (err, reply) {
            if(err){
                logger.error(err);
            }
            logger.debug(reply);
        });
        req.session.user = {name: 'henryleu', signinStatus: true};
*/
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/home', function(req, res) {
        checkUserToken(req, res);
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/share', function(req, res) {
        checkUserToken(req, res);
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/find', function(req, res) {
        checkUserToken(req, res);
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/catalog-newest', function(req, res) {
        checkUserToken(req, res);
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/catalog-hottest', function(req, res) {
        checkUserToken(req, res);
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/catalog-selfrun', function(req, res) {
        checkUserToken(req, res);
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });

    app.get('/profile', function(req, res) {
        checkUserToken(req, res);
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/forum', function(req, res) {
        checkUserToken(req, res);
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/about', function(req, res) {
        checkUserToken(req, res);
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/test', function(req, res) {
        throw new Error('test error handling');
    });
    app.get('/snippet', function(req, res) {
        res.render('snippet', {});
    });

    app.post('/deal', function(req, res) {
        var dealJson = JSON.parse(JSON.stringify(req.body));
        logger.debug(dealJson);
        var deal = new DealModel();
        deal.id = Date.now().toString();
        deal.sDesc = dealJson.sDesc;
        deal.lDesc = dealJson.lDesc;
        deal.image = dealJson.image;
        deal.save();
        logger.debug(deal);
    });

};