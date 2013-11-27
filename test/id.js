var idGenerator = require('../source/commons/id');
var rc = require('../source/commons/redis');
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

exports.testInc = function (test){
    rc.set("inc",0)
    for(var i=1;i<=10;i++){
        rc.watch("inc-lock")
        rc.get("inc",function(err,data){
            var multi = rc.multi()
            data++
            multi.incr("inc-lock")
            multi.set("inc",data)
            multi.exec(function(err,replies){
                console.log(replies)
            })
        })
    }
}