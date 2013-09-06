define(['google-analytics'], function(ga) {
    var Analytics = function(trackerName, options){
        this.options = {};
        this.init(trackerName);
    };
    Analytics.prototype.init = function(trackerName){
        this.trackerName = trackerName;
        ga('create', this.trackerName);
    };
    Analytics.prototype.create = function(o){
        //Store and override options
        for(var p in o){
            this.options[p] = o[p];
        }
        ga('create', this.trackerName, o);
    };
    Analytics.prototype.set = function(o){
        //Store and override options
        for(var p in o){
            this.options[p] = o[p];
            ga('set', p, o[p]);
        }
    };
    Analytics.prototype.send = function (o) {
        ga('send', o);
    };
    Analytics.prototype.sendHit = function (o) {
        if(!o){
            ga('send', 'pageView');
        }
        else {
            ga('send', 'pageView', o); // o can be object or string
        }
    };
    Analytics.prototype.sendEvent = function (o) {
        ga('send', 'event', o);
    };
    Analytics.prototype.sendTiming = function (category, identifier, time) {
        time = time || new Date().getTime() - window.performance.timing.domComplete;
        ga('send', 'timing', category, identifier, time);
    };

    return Analytics;
});