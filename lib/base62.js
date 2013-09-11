var RADIX = 62;
var ID62_TABLE = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var ID62_MAP = {};

for(var i=0; i<RADIX; i++){
    ID62_MAP[ID62_TABLE[i]] = i;
}

var encode = function(id){
    var codeBits = [];
    var rest = -1;

    while ( id>0 ){
        rest = id % RADIX;
        id = Math.floor(id / RADIX);
        codeBits.unshift(ID62_TABLE[rest]);
    }

    if( -1==rest && 0==id){
        codeBits.push(ID62_TABLE[0]);
    }
    else if( -1==rest && 0<id){
        throw new Error( '"id" should not be negative' );
    }
    return codeBits.join('');
}

var decode = function(code){
    if(code==null || code.length==0){
        throw new Error( "Base62 code is needed as the only argument" );
    }

    var id = 0;
    var position = 0;
    var radix = 1;
    for(var i=code.length-1; i>-1; i--, position++){
        var ch = code.charAt(i);
        var num = ID62_MAP[ch];
        if( num==null ){
            throw new Error( code + " is not legal Base62 code" );
        }
        if(position!=0){
            radix = radix * RADIX;
        }
        id += radix * num;
    }
    return id;
}

var isBase62 = function(code){
    if(code==null || code.length==0){
        return false;
    }
    var len = code.length;
    for(var i=0; i<len; i++){
        var ch = code.charAt(i);
        if(ID62_MAP[ch]){

        }
        else{
            if(ID62_MAP[ch]!==0){
                return false;
            }
        }
    }
    return true;
}
module.exports = {
    encode: encode,
    decode: decode,
    isBase62: isBase62
};