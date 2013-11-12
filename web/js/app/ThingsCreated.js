define(['jQuery', 'skeleton','./Thing'], function($, sk, Thing) {
    var ThingsCreated = sk.Collection.extend({
        model: Thing,
        name: 'ThingsCollection',
        url: '/things-auto'
    });
    return ThingsCreated;
});