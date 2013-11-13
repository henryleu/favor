var logger = require('../commons/logging').logger;
var util = require('util');
var Thing = require('../models/Thing').model;
var UserService = require('../services/UserService');
var ThingService = require('../services/ThingService');

module.exports = function(app) {
    var mode = app.get('env') || 'development';
    var asseton = require('../middlewares/asseton')(mode);

    var indexPage = function(req, res, next) {
        asseton(req, res);
        var input = {};
        var user = req.user;
        if(req.user.isNew){
            input.user = user;
            res.render('layout', input);
        }
        else{
            var uid = req.user.id;
            UserService.loadMeta(uid, function(err, meta ){
                user.meta = meta;
                input.user = user;
                res.render('layout', input);
            })
        }
    };
    app.get('/',      indexPage);
    app.get('/home', indexPage);
    app.get('/thing-:id', indexPage);
    app.get('/user', indexPage);
    app.get('/share', indexPage);
    app.get('/my-profile', indexPage);
    app.get('/my-posts', indexPage);
    app.get('/my-stars', indexPage);

    var getThingsData = function(req, res, next){
        var sort = req.params.sort || 'auto';

        if(sort=='auto'){
            Thing.find().sort({'meta.views': -1, 'meta.likes': -1, 'meta.owns': -1, 'meta.deals': -1}).exec(function(err, docs) {
                if (err) {
                    logger.error(err);
                    res.json(500, err);
                    return;
                }
                res.json(200, docs);
            })
        }
        else if(sort=='new'){
            Thing.find().sort({'updOn': -1}).limit(5).exec(function(err, docs) {
                if (err) {
                    logger.error(err);
                    res.json(500, err);
                    return;
                }
                res.json(200, docs);
            })
        }
        else if(sort=='hot'){
            Thing.find().sort({'meta.views': -1}).limit(5).exec(function(err, docs) {
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
    app.get('/things-list', function(req, res, next) {
        var ids = req.query.ids;
        console.log(ids);
        var idList = ids? ids.split('-') : [];
        Thing.list(idList, function(err, docs) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            res.json(200, docs);
        });
    });
    app.get('/things-:sort', function(req, res, next) {
        res.format({
            'text/html': indexPage,
            'application/json': getThingsData
        });
    });
    app.get('/thing/:id', function(req, res) {
        Thing.findOne({'_id': req.params.id}, function(err, doc) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            res.json(200, doc);
        });
    });

    var thingActions = {
        'star': true,
        'unstar': true,
        'like': true,
        'unlike': true,
        'clone': true
    }
    app.get('/thing/:id/:action', function(req, res) {
        var thingId = req.params.id;
        var uid = req.user.id;
        var action = req.params.action;
        logger.debug(util.format('User [%s] %ss thing [%s]', uid, action, thingId));
        if(!thingActions[action]){
            res.json(500, {error: 'API /thing/'+uid+'/'+action + ' is not supported'});
            return;
        }
        ThingService[action](uid, thingId, function(err, result) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            res.json(200, {result: result});//TODO: return a standard envelop
        });
    });

    app.post('/thing', function(req, res) {
        var postInfo = JSON.parse(JSON.stringify(req.body));
        var uid = req.user.id;
        postInfo.crtBy = uid;
        logger.debug(postInfo);
        ThingService.create(postInfo, function(err, deal, numberAffected) {
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

    app.put('/thing/:id', function(req, res) {
        var postInfo = JSON.parse(JSON.stringify(req.body));
        var thingId = req.params.id;
        var user = req.user;
        ThingService.update(postInfo, user, thingId, function(err, thing) {
            if (err) {
                logger.error(err);
                res.json(500, err);
            } else {
                logger.debug(user);
                if (user.id == thing.crtBy) {
                    thing.editable = true;
                } else {
                    thing.editable = false;
                }
                var liked = JSON.parse(user.liked);
                if (thingId in liked) {
                    thing.liked = true;
                } else {
                    thing.liked = false;
                }
                var owned = JSON.parse(user.owned);
                if (thingId in owned) {
                    thing.owned = true;
                } else {
                    thing.owned = false;
                }
                logger.debug('Updated thing: ' + thing.id);
                logger.debug(thing);
                res.json(200, [thing, {'liked': thing.liked, 'owned': thing.owned, 'editable': thing.editable}]);
            }
        });
    });

    app.delete('/thing/:id', function(req, res) {
        var uid = req.user.id;
        var thingId = req.params.id;
        ThingService.delete(uid, thingId, function(err) {
            if (err) {
                logger.error(err);
                res.json(500, err);
                return;
            }
            res.json(200, {'_id': uid});
        });
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