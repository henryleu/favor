var User = require('../models/User').model;
var UserKv = require('../kvs/User');
var UserState = require('../models/common/enums').UserState;
var settings = require('../../settings');
var crypto = require('crypto');
var logger = require('../commons/logging').logger;

var generateUserToken = function(uid){
    var key = settings.secretKey;
    return crypto.createHash('sha1').update(String(uid)).update(key).digest('hex');
};
var UserService = {
    loadByUserToken: function(utoken, callback){
        UserKv.load(utoken, callback);
    },
    create: function(callback){
        var user = new User();
        var uid = user.autoId();
        var utoken = generateUserToken(uid);
        user.utoken = utoken;
        user.stt = UserState.Anonymous;
        user.save(function(err, result, affected){
            if(err){
                logger.error('Fail to create anonymous user: ' + err);
                callback(new Error('Fail to create anonymous user: ' + err), null);
                return;
            }

            if(affected==1){
                var doc = result.toObject({getters: true});
                doc.liked = '{}';
                doc.owned = '{}';
                UserKv.save(doc, callback);
            }
            else{
                callback(new Error('Fail to create anonymous user: ' + err), null);
            }
        });
    }
};
module.exports = UserService;