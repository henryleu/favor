var logger = require('./logging').logger;
var User = require('../source/models/User').model;
var settings = require('../settings');
var crypto = require('crypto');
var id = require('./id');

var invalidTokenPage = '/public/common/invalidated-user.html';
var authenticate = function (req, res, next) {
    var utoken = req.cookies.utoken;
    var uid = null;
    //check utoken existence
    if(!utoken){
        uid = generateUserId();
        utoken = generateUserToken(uid);
        res.cookie('utoken', utoken);

        var onUserSaved = function(err, user){
            if(err){
                errorHandler(err);
                return;
            }
            logger.info('user [' + user.utoken + '] is signed up');
            setUserAuthenticated(next, req, uid, true);
        };
        saveUserInfo(uid, utoken, onUserSaved);
    }
    else{
        //Check utoken's validity
        var validatedUser = validateUserToken(utoken);
        if(!validatedUser){
            res.redirect(401, invalidTokenPage);
            return;
        }
        else{
            var onUserLoaded = function(err, doc){
                if(err){
                    errorHandler(err);
                    return;
                }
                if(!doc){
                    res.redirect(401, invalidTokenPage);
                    return;
                }
                var user = doc.toObject();
                logger.info('user [' + user.utoken + '] is loaded');
                setUserAuthenticated(next, req, user.uid, user.state);
            };
            loadUserInfo(utoken, onUserLoaded);
        }
    }
};
//TODO: generate real user id
var generateUserId = function(){
    return id(User.modelName);
};
//TODO: generate real user token which contains uid and its digest
var generateUserToken = function(uid){
    var key = settings.secretKey;
    return crypto.createHash('sha1').update(key).digest('hex');
};
//TODO: validate utoken with server-side stored key
var validateUserToken = function(utoken){
    var valid = true;

    if(valid){
        logger.debug('user [' + utoken + '] is valid ');
    }
    else{
        logger.warn('user [' + utoken + '] is NOT valid ');
    }
    return valid;
};
//TODO: save user info into mongodb and redis
var saveUserInfo = function(uid, utoken, callback){
    var user = new User({
        _id: uid,
        uid: ''+uid,
        utoken: utoken
    });
    user.save(callback);
};
//TODO: load user info from redis
var loadUserInfo = function(utoken, callback){
    var fields = {'_id': true, 'uid': true, 'utoken':true, 'state':true, 'email':true};
    User.findOne({utoken: utoken}, fields, callback);
};
var setUserAuthenticated = function(next, req, uid, state){
    var auser = {
        id: uid,
        state: state,
        timestamp: new Date().getTime()
    };
    req.auser = auser;
    logger.debug('user [' + auser.id + '] is authenticated requesting ' + req.originalUrl);
    next();
};
var errorHandler = function(err){
    logger.error(err);
};
module.exports = authenticate;