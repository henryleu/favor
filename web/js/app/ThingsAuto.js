define(['jQuery', 'skeleton','./Thing'], function($, sk, Thing) {
    var ThingsAuto = sk.Collection.extend({
        model: Thing,
        name: 'ThingsAuto',
        url: '/things-auto'
    });
    return ThingsAuto;
});