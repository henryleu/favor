define(['jQuery', 'skeleton','./Thing'], function($, sk, Thing) {
    var ThingsNew = sk.Collection.extend({
        model: Thing,
        name: 'ThingsNew',
        url: '/things-new'
    });
    return ThingsNew;
});