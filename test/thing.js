var Thing = require('../source/models/Thing').model;
var mongoose = require('../source/commons/mongoose');
var logger = require('../source/commons/logging').logger;
var list = require('./mocks/things');

exports.setUp = function(done){
    setTimeout(function(){done();}, 500);
};
//exports.tearDown = function(done){
//    done();
//};
exports.testSaveThing = function(test){
    var length = list.length;
    test.equals(length, 2);
    for(var i=0; i<length; i++){
        var item = list[i];
        logger.info( 'index ' + i + ' : ' +JSON.stringify(item) );
        var thing = new Thing(item);
        thing.save(function(err, result){
            if(err){
                logger.error('Fail to save thing: '+err);
                return;
            }
            logger.debug('succeed to save thing ' + result.name);

            Thing.findById(result._id, function (err, doc) {
                if(err){
                    logger.error('Fail to load thing: '+err);
                }
                else{
                    logger.debug('succeed to load thing ' + doc.name);
                    doc.name += ' updated';
                    doc.increment();
                    doc.save(function(err, result){
                         if(err){
                             logger.error('Fail to save thing: '+err);
                             return;
                         }
                         logger.debug('succeed to save thing ' + doc.name);
                         logger.debug(result);
                     });
                }
            });
        });
    }
    test.done();
};