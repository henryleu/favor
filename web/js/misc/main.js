define(['./Util', './Analytics', './Upai'],
function(Util, Analytics, Upai) {
    var misc = {};
    misc.Analytics = Analytics;
    //Util modify javascript native object
    //Upai modify jQuery's export-object ($) as jQuery plugin
    return misc;
});