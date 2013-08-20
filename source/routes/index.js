var logger = require('../../lib/logging').logger;
var util = require('../../lib/util');
var redis = require('../../lib/redis');
var Deal = require('../models/Deal').model;

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
        var dealInfo = JSON.parse(JSON.stringify(req.body));
        logger.debug(dealInfo);
        var newDeal = new Deal();
        newDeal.image = dealInfo.image;
        newDeal.sDesc = dealInfo.sDesc;
        newDeal.lDesc = dealInfo.lDesc;
        newDeal.dUrl = dealInfo.dUrl;
        newDeal.crtOn = Date.now();
        newDeal.crtBy = req.cookies.userToken;
        newDeal.save(function(err, deal, numberAffected) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            logger.debug('Created deal: ' + deal.id);
            logger.debug(deal);
            res.json(200, deal);
        });
    });

    app.get('/deal/:id', function(req, res) {
        Deal.findOne({'_id': req.params.id}, function(err, deal) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            logger.debug('Found deal: ' + deal.id);
            logger.debug(deal)
            res.json(200, deal);
        });
    });

    app.put('/deal/:id', function(req, res) {
        var dealInfo = JSON.parse(JSON.stringify(req.body));
        Deal.findOne({'_id': req.params.id}, function(err, oldDeal) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            oldDeal.image = dealInfo.image;
            oldDeal.sDesc = dealInfo.sDesc;
            oldDeal.lDesc = dealInfo.lDesc;
            oldDeal.dUrl = dealInfo.dUrl;
            oldDeal.updOn = Date.now();
            oldDeal.updBy = req.cookies.userToken;
            oldDeal.save(function(err, deal, numberAffected) {
                if (err) {
                    logger.error(err);
                    res.json(500, err);
                    return;
                }
                logger.debug('Updated deal: ' + deal.id);
                logger.debug(deal);
                res.json(200, deal);
            });
        })
    });

    app.delete('/deal/:id', function(req, res) {
        Deal.remove({'_id': req.params.id}, function(err) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            logger.debug('Deleted deal: ' + req.params.id);
            res.json(200, {'_id': req.params.id});
        })
    });

};