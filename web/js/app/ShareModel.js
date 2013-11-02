define(['skeleton'], function(sk) {
    var model = sk.Model.extend({
        urlRoot: '/thing'
    });
    return model;
});