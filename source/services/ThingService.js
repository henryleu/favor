var UserKv = require('../kvs/User');
var Thing = require('../models/Thing').model;
var settings = require('../../settings');
var crypto = require('crypto');
var logger = require('../commons/logging').logger;

var ThingService = {
    create: function(postInfo, callback) {
        var newThing = new Thing();
        newThing.image = postInfo.image;
        newThing.sDesc = postInfo.sDesc;
        newThing.lDesc = postInfo.lDesc;
        newThing.dUrl = postInfo.dUrl;
        newThing.save(callback);
    },
    update: function(postInfo, user, thingId, callback) {
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
    }
};
module.exports = ThingService;