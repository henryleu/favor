/**
 * Created with JetBrains WebStorm.
 * User: henryleu
 * Date: 13-6-8
 * Time: 下午4:01
 * To change this template use File | Settings | File Templates.
 */

if(!window.console){
    window.console = {};
    window.console.log = function(obj){
        //TODO
        alert(obj);
    };
}

var pad0 = function (num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
var pad1 = function (num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

var pad2 = function (num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

var pad3 = function(
    a, // the number to convert
    b // number of resulting characters
    ){
    return (
        [ 1e15 ] + a // combine with large number
        ).slice(-b) // cut leading "1"
};

var startTime = null;
var endTime = null;

/*
 pad 0
 */
var pad0Cost = null;
startTime = new Date().getTime();
for(var i=0; i < 100000; i++){
    pad0(2,2);
}
endTime = new Date().getTime();
pad0Cost = endTime -startTime;
console.log( 'pad0 = '+ pad0Cost );
/*
 pad 1
 */
var pad1Cost = null;
startTime = new Date().getTime();
for(var i=0; i < 100000; i++){
    pad1(2,10);
}
endTime = new Date().getTime();
pad1Cost = endTime -startTime;
console.log('pad1 = '+ pad1Cost);
/*
 pad 2
 */
var pad2Cost = null;
startTime = new Date().getTime();
for(var i=0; i < 100000; i++){
    pad2(2,10);
}
endTime = new Date().getTime();
pad2Cost = endTime -startTime;
console.log('pad2 = '+ pad2Cost);

/*
 pad 3
 */
var pad3Cost = null;
startTime = new Date().getTime();
for(var i=0; i < 100000; i++){
    pad3(2,10);
}
endTime = new Date().getTime();
pad3Cost = endTime -startTime;
console.log('pad3 = '+ pad3Cost);