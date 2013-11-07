var redis = require('../commons/redis');
var logger = require('../commons/logging').logger;

var userCreatesKey = function(uid){
    return 'user:' + uid + ':crts';
};

var userStarsKey = function(uid){
    return 'user:' + uid + ':stars';
};

var userLikesKey = function(uid){
    return 'user:' + uid + ':likes';
};

var UserMeta = {
    countCreates: function(uid, callback){
        var key = userCreatesKey(uid);
        redis.hlen(key, function(err, result){
            if(err){
                logger.error('Fail to get the length of creates of user ['+uid+']: ' + err);
                callback(err, 0);
                return;
            }
            callback(null, result);
        });
    },
    create: function(uid, thingId, callback){
        var key = userCreatesKey(uid);
        var now = new Date(); //TODO: use time factory to get now time
        var obj = {};
        obj[thingId] = now.getTime();

        redis.hmset(key, obj, function(err, result){
            if(err){
                logger.error('Fail to let user ['+uid+'] create thing ['+thingId+']: ' + err);
                callback(err, 0);
                return;
            }

            if(result=='OK'){
                callback(null, 1);
            }
            else{
                callback(new Error('Fail to let user ['+uid+'] create thing [' + thingId + ']'), 0);
            }
        });
    },
    uncreate: function(uid, thingId, callback){
        var key = userCreatesKey(uid);
        redis.hdel(key, thingId, function(err, result){
            if(err){
                logger.error('Fail to let user ['+uid+'] uncreate thing ['+thingId+']: ' + err);
                callback(err, 0);
                return;
            }

            callback(null, result);
        });
    },
    countStars: function(uid, callback){
        var key = userStarsKey(uid);
        redis.hlen(key, function(err, result){
            if(err){
                logger.error('Fail to get the length of stars of user ['+uid+']: ' + err);
                callback(err, 0);
                return;
            }
            callback(null, result);
        });
    },
    star: function(uid, thingId, callback){
        var key = userStarsKey(uid);
        var now = new Date(); //TODO: use time factory to get now time
        var obj = {};
        obj[thingId] = now.getTime();

        redis.hmset(key, obj, function(err, result){
            if(err){
                logger.error('Fail to let user ['+uid+'] star thing ['+thingId+']: ' + err);
                callback(err, 0);
                return;
            }

            if(result=='OK'){
                callback(null, 1);
            }
            else{
                callback(new Error('Fail to let user ['+uid+'] star thing [' + thingId + ']'), 0);
            }
        });
    },
    unstar: function(uid, thingId, callback){
        var key = userStarsKey(uid);
        redis.hdel(key, thingId, function(err, result){
            if(err){
                logger.error('Fail to let user ['+uid+'] unstar thing ['+thingId+']: ' + err);
                callback(err, 0);
                return;
            }

            callback(null, result);
        });
    },
    countLikes: function(uid, callback){
        var key = userLikesKey(uid);
        redis.hlen(key, function(err, result){
            if(err){
                logger.error('Fail to get the length of likes of user ['+uid+']: ' + err);
                callback(err, 0);
                return;
            }
            callback(null, result);
        });
    },
    like: function(uid, thingId, callback){
        var key = userLikesKey(uid);
        var now = new Date(); //TODO: use time factory to get now time
        var obj = {};
        obj[thingId] = now.getTime();

        redis.hmset(key, obj, function(err, result){
            if(err){
                logger.error('Fail to let user ['+uid+'] like thing ['+thingId+']: ' + err);
                callback(err, 0);
                return;
            }

            if(result=='OK'){
                callback(null, 1);
            }
            else{
                callback(new Error('Fail to let user ['+uid+'] like thing [' + thingId + ']'), 0);
            }
        });
    },
    unlike: function(uid, thingId, callback){
        var key = userLikesKey(uid);
        redis.hdel(key, thingId, function(err, result){
            if(err){
                logger.error('Fail to let user ['+uid+'] unlike thing ['+thingId+']: ' + err);
                callback(err, 0);
                return;
            }

            callback(null, result);
        });
    },
    getMeta: function(uid, callback){
        var crtsKey = userCreatesKey(uid);
        var starsKey = userStarsKey(uid);
        var likesKey = userLikesKey(uid);
        redis.multi()
            .hgetall(crtsKey)
            .hgetall(starsKey)
            .hgetall(likesKey)
            .exec(function (err, replies) {
                if (err) {
                    logger.error('Fail to get meta info of user [' + uid + ']: ' + err);
                    callback(err, null);
                    return;
                }

                var meta = {};
                meta.creates = replies[0] || {};
                meta.stars = replies[1] || {};
                meta.likes = replies[2] || {};
                callback(null, meta);
            });
    }
};
module.exports = UserMeta;