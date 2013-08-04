var Deal = require('../source/models/Deal').model;
var mongoose = require('../lib/mongoose');
var logger = require('../lib/logging').logger;
var list = require('./mocks/deals');

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
exports.testAddDeal = function(test){
    var length = list.length;
    test.equals(length, 2);
    for(var i=0; i<length; i++){
        var item = list[i];
        logger.info( 'index ' + i + ' : ' +JSON.stringify(item) );
        var deal = new Deal(item);
        deal.save(function(err){
            if(err){
                logger.error('Fail to save deal: '+err);
            }
            else{
                logger.info('succeed to save deal ' + deal.sDesc);
            }
        });
    }
    test.done();
};