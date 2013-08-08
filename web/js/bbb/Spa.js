define(['Underscore', 'Backbone', 'jQuery', 'JST'], function(_, bb, $, jst) {
    _apply = function(t, s) {
        for (var k in s) {
            if(!t[k]){
                t[k] = s[k];
            }
        }
    };

    var spaOptions = ['templates'];
    var spa = bb.Router.extend({
        //models: null, // the SPA's models registry/cache
        //views: null, // the SPA's views registry/cache
        //tm: null, //the SPA's TemplateManager
        //templates: null, // []: the SPA's templates input
        //root: null, //application 's root path as a SPA
        defaults: function (){
            return {
                models: {},
                views: {},
                templates: [],
                root: '/'
            }
        },
        initialize: function(options){
            this.tm = new TemplateManager(jst);
            _apply(this, this.defaults());
            _apply(this, _.pick(options, spaOptions));
            this.configure.apply(this, arguments);
        },
        configure: function(){},
        startup: function(){
            var me = this;
            me.navigate();
            bb.history.start({pushState: true, hashChange: true});
        },
        shutdown: function(){
            //TODO
        },
        navigate: function(){
            var me = this;
            $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") }; // Get the absolute anchor href.
                var root = location.protocol + "//" + location.host + me.root; // Get the absolute root.
                // Ensure the root is part of the anchor href, meaning it's relative.
                if (href.prop.slice(0, root.length) === root) {
                    evt.preventDefault();

                    /* `Backbone.history.navigate` is sufficient for all Routers and will
                     * trigger the correct events. The Router's internal `navigate` method
                     * calls this anyways.  The fragment is sliced from the root.
                     */
                    Backbone.history.navigate(href.attr, true);
                }
            });
        }
    });
    return spa;
});