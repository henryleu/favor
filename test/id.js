var idGenerator = require('../lib/id');

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
        var num = 0;
        for(var i=0; i<size; i++){
            var so = idGenerator.get();
            so = so.next();
            id = so.toId();
            num = so.toNum();
            console.info('id: '+id + ', num: ' + num);
        }
        test.done();
    }), 1000);
};