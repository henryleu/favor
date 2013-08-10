var logger = require('./logging').logger;
var invalidTokenPage = '/public/common/invalidated-user.html';
var authenticate = function (req, res, next) {
    var utoken = req.cookies.utoken;

    //check utoken existence
    if(utoken){

        //Check utoken's validity
        var validatedUser = validateUserToken(utoken);
        if(!validatedUser){
            res.redirect(401, invalidTokenPage);
            return;
        }
    }
    else{
        utoken = generateUserToken();
        res.cookie('utoken', utoken);
        logger.info('user [' + utoken + '] is signed up');
    }
    loadUserInfo(utoken, req, next);
};
//TODO: generate real token which contains uid and its digest
var generateUserToken = function(){
    return new Date().getTime();
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
//TODO: load user info from redis
var loadUserInfo = function(utoken, req, next){
    var auser = {
        id: utoken,
        timestamp: new Date().getTime()
    };
    req.auser = auser;
    logger.debug('user [' + auser.id + '] is requesting ' + req.originalUrl);
    next();
};
module.exports = authenticate;