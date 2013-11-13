define(['jQuery', 'skeleton','./Thing'], function($, sk, Thing) {
    var ThingsCollection = sk.Collection.extend({
        model: Thing,
        name: 'ThingsCollection',
        url: '/things/auto'
    });
    return ThingsCollection;
});