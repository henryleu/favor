var Base62 = require('../lib/base62');

exports.setUp = function(done){
    done();
};
exports.tearDown = function(done){
    done();
};

exports.testConvert = function(test){
    var id1  = 0;
    var id2  = 1;
    var id21  = 9;
    var id22  = 10;
    var id3  = 61;
    var id4  = 62;
    var id5  = 63;
    var id6  = 100;
    var id7  = 1000;
    var id71 = 10000;
    var id72 = 100000;
    var id73 = 1000000;

    var id8  = 1234234323;
    var id9  = 1000000000000;     //1 Trillion
    var id10 = 3000000000000;     //3 Trillion
    var id11 = 100000000000000;   //100 Trillion
    var id12 = (Math.pow(2, 27)-1)<<4;   //Max integer for bitwise operations 2147483647

    var id = 0;
    var idConverted = 0;
    var code = null;

    id = id1;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id2;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id21;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id22;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id3;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id4;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id5;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id6;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id7;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id71;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id72;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id73;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id8;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id9;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id10;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id11;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );

    id = id12;
    code = Base62.encode( id ); idConverted = Base62.decode( code ); test.equals( idConverted, id );
    console.info( id +  " -> " + code +  " -> " + idConverted );
    console.info('' + (62*62*62*62*62) + '\r\n');

    test.done();
};

exports.testPerformance = function(test){
    var count = 20000;
    var index = 10000;
    var len = count-index;
    var id = null;
    var code = null;
    var isBase62 = null;
    var codes = new Array(len);
    var start = null;
    var end = null;

    start = new Date().getTime();
    for(var i=index; i<count; i++){
        code = Base62.encode(i);
        codes.unshift(code);
        //console.info('' + i + ' -> ' + code);
    }
    end = new Date().getTime();
    console.info('It took ' + (end-start) + ' milliseconds to encode ' + len + ' ids to base62 codes');

    start = new Date().getTime();
    for(var i=0; i<len; i++){
        id = Base62.decode(codes[i]);
        //console.info(codes[i] + ' -> ' + id);
    }
    end = new Date().getTime();
    console.info('It took ' + (end-start) + ' milliseconds to decode ' + len + ' base62 codes to ids');

    start = new Date().getTime();
    for(var i=0; i<len; i++){
        isBase62 = Base62.validate(codes[i]);
//        test.equals(isBase62, true);
    }
    end = new Date().getTime();
    console.info('It took ' + (end-start) + ' milliseconds to check ' + len + ' base62 codes');
    console.info('\r\n');
    test.done();
};