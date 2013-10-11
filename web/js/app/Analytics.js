define(['misc/Analytics', 'skeleton', 'config'], function(Analytics, sk, config) {
    var config = window.appConfig.analytics;
    var analytics = new Analytics(config.trackerName, config.options);
    //Send hit event to ga
    sk.history.on('route', function(router, route, params){
        analytics.sendHit();
    });
    return analytics;
});