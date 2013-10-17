var SequenceGenerator = require('./sequence').sg;
var SequenceObject = require('./sequence').so;
var base62 = require('./base62');
var redisClient = require('./redis');

SequenceObject.prototype.toId = function() {
    return base62.encode(this.val*256);
};

var seq = new SequenceGenerator(
    {
        dsc: {
            initialValue: 0,
            step: 1000,
            bookStep: 500
        },
        defaultKey: 'global',
        keyPrefix: 'seq:id:',
        redisClient: redisClient
    },
    [{
        key: 'ComingRequest',
        initialValue: 0,
        step: 100000,
        bookStep: 50000
    },{
        key: 'User',
        initialValue: 0,
        step: 1000,
        bookStep: 500
    },{
        key: 'Thing',
        initialValue: 0,
        step: 1000,
        bookStep: 500
    },{
        key: 'Deal'
    }]
);
seq.setup();
setTimeout(function(){
    seq.init();
},200);

module.exports = seq;