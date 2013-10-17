define(['Underscore', 'Backbone', 'jQuery', './Navigation', './Router', './View', './JstLoader'],
function(_, bb, $, Navigation, Router, View, JstLoader) {
    var Spa = function(options){
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(Spa.prototype, bb.Events, {
        initialize: function(options){
            var me = this;
            _.extend(this, options);
            _.defaults(this, Spa.defaults);
            this.navigation = new Navigation({root: this.root});
            this.jstLoader = new JstLoader({mode: this.mode, prefix: this.jstPrefix, JST: this.JST});
            this.jstLoader.loadTemplates(View.templates, function(){
                me.navigation.hook($(document)); //use navigation callback instead of default link behavior
                me.configure.apply(me, options);
                Router.start();
            });
        },
        configure: function(){}
    });

    Spa.defaults = {
        mode: 'development', //development or production
        root: '/',
        jstPrefix: '/web/template'
    };

    Spa.extend = bb.History.extend;

    return Spa;
});