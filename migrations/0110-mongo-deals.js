var Deal = require('../source/models/Deal');
var list = require('../source/models/deals');
var logger = require('../source/commons/logging').logger;
exports.up = function(next){
    console.info("initialize deals test data in mongodb...");

    for(var i=0; i<list.length; i++){
        var item = list[i];
        logger.info( 'index ' + i + ' : ' +JSON.stringify(item) );
        var deal = new Deal(item);
        deal.save(function(err){
            if(err){
                console.error('Fail to save deal: '+err);
            }
            else{
                console.error('succeed to save deal ' + deal.sDesc);
            }
        });
    }
    next();
};

exports.down = function(next){
    console.info("un-initialize deals test data in mongodb...");
    next();
};
