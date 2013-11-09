var UserKv = require('../kvs/User');
var UserMetaKv = require('../kvs/UserMeta');
var Thing = require('../models/Thing').model;
var settings = require('../../settings');
var crypto = require('crypto');
var logger = require('../commons/logging').logger;

var ThingService = {};
ThingService.create = function(thingJson, callback) {
    var newThing = new Thing(thingJson);
    var uid = thingJson.crtBy;
    newThing.save(function(err, doc, numberAffected){
        if (err) {
            callback(err);
            return;
        }
        if(numberAffected){
            UserMetaKv.create(uid, doc.id, callback);
        }
        else{
            callback(new Error('Fail to create Thing by user ' + uid));
        }
    });
};
ThingService.delete = function(uid, thingId, callback) {
    Thing.findByIdAndRemove(thingId, function(err, thing) {
        if (err) {
            callback(err);
            return;
        }
        if(thing){
            UserMetaKv.uncreate(uid, thingId, callback);
        }
        else{
            callback(null, 0);
        }
    });
};
ThingService.clone = function(uid, thingId, callback) {
    Thing.findById(thingId, function(err, thing) {
        if (err) {
            callback(err);
            return;
        }
        ThingService.create(thing.clone(uid).toObject(), callback);
    });
};
ThingService.update = function(postInfo, user, thingId, callback) {
    Thing.findOne({'_id': thingId}, function(err, oldThing) {
        if (err) {
            callback(err);
            return;
        }
        switch (postInfo.actionType) {
            case 'update':
                oldThing.image = postInfo.image;
                oldThing.sDesc = postInfo.sDesc;
                oldThing.lDesc = postInfo.lDesc;
                oldThing.dUrl = postInfo.dUrl;
                oldThing.save(function(err, thing, numberAffected) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(err, thing);
                });
                break;
            case 'view':
                oldThing.meta.views += 1;
                oldThing.save(function(err, thing, numberAffected) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(err, thing);
                });
                break;
            case 'like':
                var liked = JSON.parse(user.liked);
                liked[thingId] = '';
                user.liked = JSON.stringify(liked);
                logger.debug(user.liked);
                UserKv.saveProps(user, 'liked', function(err, result) {
                    if (err) {
                        logger.error('Failed to save liked thing ' + thingId + ' for user ' + user.id);
                        return;
                    }
                    logger.debug('Saved liked thing ' + thingId + ' for user ' + user.id);
                });
                oldThing.meta.likes += 1;
                oldThing.save(function(err, thing, numberAffected) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(err, thing);
                });
                break;
            case 'own':
                var owned = JSON.parse(user.owned);
                owned[thingId] = '';
                user.owned = JSON.stringify(owned);
                logger.debug(user.owned);
                UserKv.saveProps(user, 'owned', function(err, result) {
                    if (err) {
                        logger.error('Failed to save owned thing ' + thingId + ' for user ' + user.id);
                        return;
                    }
                    logger.debug('Saved owned thing ' + thingId + ' for user ' + user.id);
                });
                oldThing.meta.owns += 1;
                oldThing.save(function(err, thing, numberAffected) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(err, thing);
                });
                break;
            default:
                callback(err, oldThing);
                break;
        }
    })
};
ThingService.star = function(utoken, thingId, callback){
    UserMetaKv.star(utoken, thingId, function(err, affected){
        if (err) {
            callback(err);
            return;
        }
//        logger.debug('thing ' + thingId + ' has been starred ' + stars + ' times');
        Thing.star(thingId, utoken, callback);
    });
};
ThingService.unstar = function(utoken, thingId, callback){
    UserMetaKv.unstar(utoken, thingId, function(err, affected){
        if (err) {
            callback(err);
            return;
        }
//        logger.debug('thing ' + thingId + ' has been starred ' + stars + ' times');
        Thing.unstar(thingId, utoken, callback);
    });
};
ThingService.like = function(utoken, thingId, callback){
    UserMetaKv.like(utoken, thingId, function(err, affected){
        if (err) {
            callback(err);
            return;
        }
        Thing.like(thingId, utoken, callback);
    });
};
ThingService.unlike = function(utoken, thingId, callback){
    UserMetaKv.unlike(utoken, thingId, function(err, affected){
        if (err) {
            callback(err);
            return;
        }
        Thing.unlike(thingId, utoken, callback);
    });
};
module.exports = ThingService;