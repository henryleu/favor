var logger = require('../commons/logging').logger;
var Deal = require('../models/Deal').model;
var UserLikedDeal = require('../models/UserLikedDeal').model;
var UserOwnedDeal = require('../models/UserOwnedDeal').model;

module.exports = function(app) {
    var mode = app.get('env') || 'development';
    var asseton = require('../middlewares/asseton')(mode);

    var indexPage = function(req, res, next) {
        asseton(req, res);
        var input = {};
        res.render('index', input);
    };
    app.get('/',      indexPage);
    app.get('/find',  indexPage);
    app.get('/share', indexPage);
    app.get('/forum', indexPage);
    app.get('/about', indexPage);
    app.get('/user', indexPage);
    app.get('/things-:sort', function(req, res, next) {
        res.format({
            'text/html': indexPage,
            'application/json': getThingsData
        });
    });

    var getThingsData = function(req, res, next){
//        var sort = req.query.sort || 'auto';
        var sort = req.params.sort || 'auto';

        if(sort=='auto'){
            Deal.find().sort({'meta.views': -1, 'meta.likes': -1, 'meta.owns': -1, 'meta.deals': -1}).exec(function(err, docs) {
                if (err) {
                    logger.error(err);
                    res.json(500, err);
                    return;
                }
                res.json(200, docs);
            })
        }
        else if(sort=='new'){
            Deal.find().sort({'updOn': -1}).limit(5).exec(function(err, docs) {
                if (err) {
                    logger.error(err);
                    res.json(500, err);
                    return;
                }
                res.json(200, docs);
            })
        }
        else if(sort=='hot'){
            Deal.find().sort({'meta.views': -1}).limit(5).exec(function(err, docs) {
                if (err) {
                    logger.error(err);
                    res.json(500, err);
                    return;
                }
                res.json(200, docs);
            })
        }
        else{
            res.json(200, []);
        }
    };
    app.get('/things', getThingsData);

    app.post('/deal', function(req, res) {
        var dealInfo = JSON.parse(JSON.stringify(req.body));
        logger.debug(dealInfo);
        var newDeal = new Deal();
        newDeal.image = dealInfo.image;
        newDeal.sDesc = dealInfo.sDesc;
        newDeal.lDesc = dealInfo.lDesc;
        newDeal.dUrl = dealInfo.dUrl;
        //those will be generated and populated automatically
//        newDeal.crtBy = req.user.id;
//        newDeal.crtOn = Date.now();
//        newDeal.updBy = newDeal.crtBy;
//        newDeal.updOn = newDeal.crtOn;
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
        var uid = req.user.id;
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
                        var editable = false;
                        if (uid == oldDeal.crtBy) {
                            editable = true;
                        }
                        res.json(200, [deal, {'liked': dealInfo.liked, 'owned': dealInfo.owned, 'editable': editable}]);
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

    app.get('/things', function(req, res, next) {
        Deal.find().sort({'meta.views': -1, 'meta.likes': -1, 'meta.owns': -1, 'meta.deals': -1}).exec(function(err, docs) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            res.json(200, docs);
        })
    });

    app.get('/upaireturn', function(req, res) {
        var uploadResult = {
            code: req.param('code'),
            message: req.param('message'),
            url: req.param('url'),
            time: req.param('time'),
            sign: req.param('sign')
        };
        if (req.param('code') != '200') {
            console.error(uploadResult);
        } else {
            console.debug(uploadResult);
        }
        res.json(uploadResult);
    });

};