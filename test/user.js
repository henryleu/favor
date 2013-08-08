var User = require('../source/models/User').model;
var mongoose = require('../lib/mongoose');
var logger = require('../lib/logging').logger;
var list = require('./mocks/users');

exports.setUp = function(done){
    done();
};
exports.tearDown = function(done){
    mongoose.disconnect(function(err){
        if(err) {
            logger.error(err);
            return;
        }
        logger.info('mongoose is disconnected');
    });
    done();
};
exports.testAddUser = function(test){
    var length = list.length;
    test.equals(length, 2);
    for(var i=0; i<length; i++){
        var item = list[i];
        logger.info( 'index ' + i + ' : ' +JSON.stringify(item) );
        var user = new User(item);
        user.save(function(err){
            if(err){
                logger.error('Fail to save user: '+err);
            }
            else{
                logger.info('succeed to save user ' + user.username);
            }
        });
    }
    test.done();
};