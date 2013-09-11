var idGenerator = require('../lib/id-generator');

exports.setUp = function(done){
    done();
};
exports.tearDown = function(done){
    done();
};
exports.testNext = function(test){
    setTimeout((function() {
        var size = 100;
        var id = 0;
        for(var i=0; i<size; i++){
            id = idGenerator.next();
            console.info('id: '+id);
        }
        test.done();
    }), 1000);
};