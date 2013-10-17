var UserService = require('../../source/services/UserService');
var mongoose = require('../../source/commons/mongoose');
var logger = require('../../source/commons/logging').logger;
var list = require('./../mocks/users');

exports.setUp = function(done){
    setTimeout(function(){done();}, 500);
};
exports.tearDown = function(done){
    done()
};
exports.testCreateAnonymousUser = function(test){
    UserService.create(function(err, user){
        if(err){
            logger.error('Fail to create anonymous user: '+err);
        }
        else{
            logger.debug('Succeed to create anonymous user ' + JSON.stringify(user));
            test.ok(true);
        }
    });
    test.done();
};
exports.testLoadAnonymousUser = function(test){
    UserService.create(function(err, user){
        if(err){
            logger.error('Fail to create anonymous user: '+err);
        }
        else{
            logger.debug('Succeed to create anonymous user ' + JSON.stringify(user));
            UserService.loadByUserToken(user.utoken, function(err, user){
                if(err){
                    logger.error('Fail to load anonymous user [' + user.utoken + ']: '+err);
                }
                else{
                    if(user){
                        logger.debug('Succeed to load anonymous user: ' + JSON.stringify(user));
                    }
                    else{
                        logger.debug('Fail to load anonymous user [' + user.utoken + '], it doesn\'t exist ');
                    }
                }
            });
        }
    });
    test.done();
};