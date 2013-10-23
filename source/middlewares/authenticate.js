var UserService = require('../services/UserService');
var logger = require('../commons/logging').logger;
var invalidTokenPage = '/public/common/invalidated-user.html'; //TODO:

var authenticate = function (req, res, next) {
//    var user = req.session.user;
//    if(user){
//        setupContext(req, res, user);
//        next();
//        return;
//    }
    var user = null;
    var utoken = req.cookies.utoken;
    //check utoken existence
    if(!utoken){
        var onUserCreated = function(err, user){
            if(err){
                errorHandler(err);
                return;
            }
            logger.info('User [' + user.id + '] is signed up');
            user.isNew = true;
            setUserAuthenticated(next, req, res, user);
        };
        UserService.create(onUserCreated);
    }
    else{
        //Check utoken's validity
        var validatedUser = validateUserToken(utoken);
        if(!validatedUser){
            res.redirect(401, invalidTokenPage);
            return;
        }
        else{
            var onUserLoaded = function(err, user){
                if(err){
                    errorHandler(err);
                    return;
                }
                if(!user){
                    res.redirect(401, invalidTokenPage);
                    return;
                }
                logger.info('User [' + user.id + '] is loaded');
                user.isNew = false;
                setUserAuthenticated(next, req, res, user);
            };
            UserService.loadByUserToken(utoken, onUserLoaded);
        }
    }
};
var errorHandler = function(err){
    logger.error(err);
};
var setupContext = function(req, res, user){
    req.user = user;
    res.locals.user = req.user;
    res.cookie('utoken', user.utoken);
    logger.debug('User [' + user.id + '] is requesting ' + req.originalUrl);
};
var setUserAuthenticated = function(next, req, res, user){
//    req.session.user = user; //TODO: remove session later soon
    logger.debug('User [' + user.id + '] is signed in ');
    setupContext(req, res, user);
    next();
};
var validateUserToken = function(utoken){
    var valid = true;
    //TODO: validate utoken with server-side stored key
    if(valid){
        logger.debug('User [' + utoken + '] is valid ');
    }
    else{
        logger.warn('User [' + utoken + '] is NOT valid ');
    }
    return valid;
};

module.exports = authenticate;