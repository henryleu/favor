define(['skeleton'], function(sk) {
    var model = new sk.Model({
        idAttribute: '_id',
        urlRoot: '/deal'
    });
    return model;
});