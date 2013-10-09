define(['Underscore', 'Backbone', 'jQuery'], function(_, bb, $) {
    var Navigation = function(options){
        options || (options = {});
        this.initialize.apply(this, arguments);
    };
    _.extend(Navigation.prototype, bb.Events, {
        root: '/',
        initialize: function(options){
            _.extend(this, options);
            this.configure.apply(this, options);
        },
        configure: function(){},
        hook: function($el){
            var me = this;
            $el.on("click", "a[href]:not([data-bypass])", function(evt) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") }; // Get the absolute anchor href.
                var root = location.protocol + "//" + location.host + me.root; // Get the absolute root.
                // Ensure the root is part of the anchor href, meaning it's relative.
                if (href.prop.slice(0, root.length) === root) {
                    evt.preventDefault();

                    /* `Backbone.history.navigate` is sufficient for all Routers and will
                     * trigger the correct events. The Router's internal `navigate` method
                     * calls this anyways.  The fragment is sliced from the root.
                     */
                    bb.history.navigate(href.attr, {trigger: true});
                }
            });
        }
    });

    return Navigation;
});