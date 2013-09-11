var SequenceGenerator = require('./sequence').sg;
var redisClient = require('./redis');
var seq = new SequenceGenerator(
    {
        dsc: {
            initialValue: 0,
            step: 1000,
            bookStep: 500
        },
        defaultKey: 'global',
        keyPrefix: 'seq:',
        redisClient: redisClient
    },
    [{
        key: 'User',
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