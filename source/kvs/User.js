var redis = require('../commons/redis');
var _ = require('underscore');
var logger = require('../commons/logging').logger;

var userKey = function(utoken){
    return 'utoken:' + utoken;
};
var userProps = ['id', 'lFlg', 'stt', 'utoken', 'username', 'email'];

var User = {
    load: function(utoken, callback){
        var key = userKey(utoken);
        redis.hgetall(key, function(err, result){
            if(err){
                logger.error('Fail to load anonymous user: ' + err);
                callback(err, null);
                return;
            }

            if(result){
                callback(err, result);
            }
            else{
                callback(null, null);
            }
        });
    },
    save: function(user, callback){
        user = _.pick(Object(user), userProps);
        var key = userKey(user.utoken);
        redis.hmset(key, user, function(err, result){
            if(err){
                logger.error('Fail to create anonymous user: ' + err);
                callback(err, null);
                return;
            }

            if(result=='OK'){
                callback(err, user);
            }
            else{
                callback(new Error('Fail to create anonymous user'), null);
            }
        });
    }
};
module.exports = User;