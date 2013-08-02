var logger = require('../lib/logging').logger;
var util = require('../lib/util');
var redis = require('../lib/redis');
var Deal = require('../source/models/Deal');

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
        req.session.lastAccessTime = new Date();
        res.render('snippet', {});
    });

    app.post('/deal', function(req, res) {
        var dealJson = JSON.parse(JSON.stringify(req.body));
        logger.debug(dealJson);
        var deal = new Deal();
        deal.id = Date.now().toString();
        deal.sDesc = dealJson.sDesc;
        deal.lDesc = dealJson.lDesc;
        deal.image = dealJson.image;
        deal.createdOn = Date.now();
        deal.save();
        logger.debug(deal);
    });

};