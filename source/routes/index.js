var logger = require('../../lib/logging').logger;
var util = require('../../lib/util');
var redis = require('../../lib/redis');
var Deal = require('../models/Deal').model;
var UserLikedDeal = require('../models/UserLikedDeal').model;
var UserOwnedDeal = require('../models/UserOwnedDeal').model;

module.exports = function(app) {
    app.get('/', function(req, res) {
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
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/share', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/find', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/catalog-newest', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/catalog-hottest', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/catalog-selfrun', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });

    app.get('/profile', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/forum', function(req, res) {
        var input = {};
        util.apply(input, req.asset || {});
        res.render('index', input);
    });
    app.get('/about', function(req, res) {
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
        Deal.findOne({'_id': req.params.id}, function(err, foundDeal) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            logger.debug('Found deal: ' + foundDeal.id);
            logger.debug(foundDeal);
            res.json(200, foundDeal);
        });
    });

    app.put('/deal/:id', function(req, res) {
        var dealInfo = JSON.parse(JSON.stringify(req.body));
        logger.debug('Inbound dealInfo: ');
        logger.debug(dealInfo);
        var uid = req.cookies.userToken;
        var dealId = req.params.id;
        Deal.findOne({'_id': dealId}, function(err, oldDeal) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            UserLikedDeal.findOne({'uid': uid, 'dealId': dealId}, function(err, userLiked) {
                if (err) {
                    logger.error(err);
                    res.json(500, err);
                    return;
                }
                if (userLiked) dealInfo.liked = true;
                else dealInfo.liked = false;
            });
            UserOwnedDeal.findOne({'uid': uid, 'dealId': dealId}, function(err, userOwned) {
                if (err) {
                    logger.error(err);
                    res.json(500, err);
                    return;
                }
                if (userOwned) dealInfo.owned = true;
                else dealInfo.owned = false;
            });
            switch (dealInfo.actionType) {
                case 'update':
                    oldDeal.image = dealInfo.image;
                    oldDeal.sDesc = dealInfo.sDesc;
                    oldDeal.lDesc = dealInfo.lDesc;
                    oldDeal.dUrl = dealInfo.dUrl;
                    oldDeal.updOn = Date.now();
                    oldDeal.updBy = uid;
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
                    break;
                case 'view':
                    oldDeal.meta.views += 1;
                    oldDeal.save(function(err, deal, numberAffected) {
                        if (err) {
                            logger.error(err);
                            res.json(500, err);
                            return;
                        }
                        res.json(200, [deal, {'liked': dealInfo.liked, 'owned': dealInfo.owned}]);
                    });
                    break;
                case 'like':
                    var userLiked = new UserLikedDeal();
                    userLiked.uid = uid;
                    userLiked.dealId = dealId;
                    userLiked.crtOn = Date.now();
                    userLiked.save(function(err, liked, numberAffected) {
                        if (err) {
                            logger.error(err);
                            res.json(500, err);
                            return;
                        }
                        oldDeal.meta.likes += 1;
                        oldDeal.save(function(err, deal, numberAffected) {
                            if (err) {
                                logger.error(err);
                                res.json(500, err);
                                return;
                            }
                            res.json(200, [deal, {'liked': true, 'owned': dealInfo.owned}]);
                        });
                    });
                    break;
                case 'own':
                    var userOwned = new UserOwnedDeal();
                    userOwned.uid = uid;
                    userOwned.dealId = dealId;
                    userOwned.crtOn = Date.now();
                    userOwned.save(function(err, owned, numberAffected) {
                        if (err) {
                            logger.error(err);
                            res.json(500, err);
                            return;
                        }
                        oldDeal.meta.owns += 1;
                        oldDeal.save(function(err, deal, numberAffected) {
                            if (err) {
                                logger.error(err);
                                res.json(500, err);
                                return;
                            }
                            deal.owned = true;
                            logger.debug(deal);
                            res.json(200, [deal, {'liked': dealInfo.liked, 'owned': true}]);
                        });
                    });
                    break;
                default:
                    res.json(200, oldDeal);
                    break;
            }
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