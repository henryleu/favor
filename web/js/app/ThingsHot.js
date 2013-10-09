define(['jQuery', 'skeleton','./Thing'], function($, sk, Thing) {
    var ThingsHot = sk.Collection.extend({
        model: Thing,
        name: 'ThingsHot',
        url: '/things-hot'
    });
    return ThingsHot;
});