/**
 * Created with JetBrains WebStorm.
 * User: henryleu
 * Date: 13-6-9
 * Time: 下午3:34
 * To change this template use File | Settings | File Templates.
 */


/*
var sequenceObjectMap = {};
var valve = 100;
var sequence = function(key){
    var seqObj = sequenceObjectMap[key];
    var seq = null;
    if(seqObj){
        seqObj = {
            key: key,
            valve: valve
        };
    }
    else{
        seqObj.sequence;
    }
}
*/
    var redisClient = null;
    var count = redisClient.get('count');
    var stepSize = 1000;
    var initCount = 0;
    count = count ? count : initCount;
    var counterMax = count + stepSize;
    redisClient.set('count', counterMax);
    var counter = function(){
        ++count;
        if(count>=counterMax){
            counterMax = count + stepSize;
            redisClient.set('count', counterMax);
        }
        return count;
    }
    module.exports = {
        nextValue: counter
    }
