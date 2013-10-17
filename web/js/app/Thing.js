define(['jQuery', 'skeleton'], function($, sk) {
    var Thing = sk.Model.extend({
        name: 'Thing',
        urlRoot: '/thing'
    });
    return Thing;
});