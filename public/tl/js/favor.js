
(function($){
});
var Workspace = Backbone.Router.extend({
    routes: {
        "*view(/:id)": "switchView",
        "home": "home",
        "my": "my",
        "catalog": "catalog",
        "profile": "profile",
        "forum": "forum",
        "about": "about"
    },
    root: '/',
    defaultUri: 'home',
    switchView: function(view, id){
        console.log(view + ' - ' + id);
        var viewName = '';
        var viewAction = null;
        if(this.routes[view]){
            viewName = view;
        }
        else if(view==null){
            viewName = this.defaultUri;
        }
        else{
            console.warn( "/"+view + '/'+(id?id:'' + ' is not valid URI') );
            //TODO: alert or redirect
        }

        if(viewName){
            console.log('viewName - ' + viewName);
            var viewAction = this.routes[viewName];
            this[viewAction](viewAction, id);
            console.log('viewAction - ' + this[viewAction]);
            $('li>a[set]').parent().removeClass('active');
            $('li>a[set="'+viewName+'"]').parent().addClass('active');
            $('.view').hide();
            $('[set="'+viewName+'"].view').show();
        }
    },
    home: function(){
    },
    my: function(){
    },
    catalog: function(){
    },
    profile: function(){
    },
    forum: function(){
    },
    about: function(){
    }
});

$(document).ready(function(){
    var workspace = new Workspace();
    Backbone.history.start({pushState: true, hashChange: true});
    $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
        var href = { prop: $(this).prop("href"), attr: $(this).attr("href") }; // Get the absolute anchor href.
        var root = location.protocol + "//" + location.host + workspace.root; // Get the absolute root.
        // Ensure the root is part of the anchor href, meaning it's relative.
        if (href.prop.slice(0, root.length) === root) {
            evt.preventDefault(); // stop page refresh.

            // `Backbone.history.navigate` is sufficient for all Routers and will
            // trigger the correct events. The Router's internal `navigate` method
            // calls this anyways.  The fragment is sliced from the root.
            Backbone.history.navigate(href.attr, true);
        }
    });
});