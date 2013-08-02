var Deal = require('../source/models/Deal');
var mongoose = require('../lib/mongoose');
//var mongodb = require('../lib/mongodb');
var list = require('../source/models/deals');
var logger = require('../lib/logging').logger;

exports.setUp = function(done){
    console.info('start test...');
    done();
};
exports.tearDown = function(done){
    console.info('end test...');
    mongoose.disconnect(function(err){console.error(err);});
    done();
};
/*
 */
exports.testAddDeal = function(test){
    var length = list.length;
    test.equals(length, 2);
    for(var i=0; i<length; i++){
        var item = list[i];
        console.info( 'index ' + i + ' : ' +JSON.stringify(item) );
        var deal = new Deal(item);
        deal.save(function(err){
            if(err){
                console.error('Fail to save deal: '+err);
            }
            else{
                console.info('succeed to save deal ' + deal.sDesc);
            }
        });
    }
    setTimeout(function(){test.done();},200);
//    test.done();
};


//exports.testInsertDeal = function(test){
//    var length = list.length;
//    test.equals(length, 2);
//    mongodb.open(function(err,db){
//        if(err){
//            logger.error(err);
//            return;
//        }
//        logger.info("mongodb is connected!");
//
//        db.collection('deals',function(err,collection){
//            for(var i=0; i<length; i++){
//                var item = list[i];
//                collection.insert(item, function(err, result){
//                    if(err){
//                        logger.error('Fail to insert document deal [' + item.id + ']');
//                        return;
//                    }
//                    logger.info( 'index ' + i + ' : ' +JSON.stringify(item) );
//                    test.expect(1, 'deal '+item.name+' is inserted');
//                });
//            }
//        });
//        test.expect(1);
//    });
//    test.done();
//};
