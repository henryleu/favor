define(['Underscore', 'Backbone', './Skeleton'], function(_, bb, Skeleton) {
    var Router = bb.Router.extend({
        initialize: function(options){
            this.configure.apply(this, arguments);
        },
        configure: function(){}
    });
    Router.start = function(options){
        var defaultOptions = {pushState: true, hashChange: true};
        var o = options || {};
        _.defaults(o, defaultOptions);
        Skeleton.history.start(o);
    };
    Router.stop = function(){
        Skeleton.history.stop();
    };

    Router.extend = bb.History.extend;

    return Router;
});