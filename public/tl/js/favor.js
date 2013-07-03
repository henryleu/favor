
(function($){
});

var TemplateManager = function(options){
    this.templates = {};
    this.o = {};
    if(options){
        _.extend(this.o, options);
        _.extend(this, _.pick(this.o, 'prefix'));
    }
};
_.extend( TemplateManager.prototype, {
    prefix: 'templates',
    templates: {},
    loadTemplates: function(names, callback) {
        var me = this;
        var loadTemplate = function(index) {
            var name = names[index];
            console.log('Loading view template: ' + name);
            $.get( me.prefix + '/' + name + '.html', function(data) {
                me.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get: function(name) {
        return this.templates[name];
    }
});
var tpl = {
    // Hash of preloaded templates for the app
    templates: {},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment:
    // All the template files should be concatenated in a single file.
    loadTemplates: function(names, callback) {
        var that = this;
        var loadTemplate = function(index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get('templates/' + name + '.html', function(data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get: function(name) {
        return this.templates[name];
    }
};
var tm = new TemplateManager();
var LargeIconsView = Backbone.View.extend({
    templateName: 'large-icons',
    events: {
        "change #newest":          "goNewest",
        "change #hottest":          "goHottest",
        "change #selfrun":          "goSelfrun"
    },
    initialize: function() {
    },
    render: function() {
//        if(!this.template){
//            var rawTemplate = $('#' + this.templateName + '-tpl').html();
//            this.template = _.template(rawTemplate);
//        }
        if(!this.template){
            this.template = _.template(tm.get(this.templateName));
        }
        $(this.el).html(this.template(this.model));
        return this;
    },
    goNewest: function() {
    },
    goHottest: function() {
    },
    selfrun: function() {
    }
});
var MediumIconsView = Backbone.View.extend({
    templateName: 'medium-icons',
    events: {
        "change #newest":          "goNewest",
        "change #hottest":          "goHottest",
        "change #selfrun":          "goSelfrun"
    },
    initialize: function() {
    },
    render: function() {
        if(!this.template){
            this.template = _.template(tm.get(this.templateName));
        }
        $(this.el).html(this.template(this.model));
        return this;
    },
    goNewest: function() {
    },
    goHottest: function() {
    },
    selfrun: function() {
    }
});
var Workspace = Backbone.Router.extend({
    routes: {
        "catalog-newest": "catalogNewest",
        "catalog-hottest": "catalogHottest",
        "catalog-selfrun": "catalogSelfrun",
        "*view(/:id)": "switchView",
        "home": "home",
        "my": "my",
        "catalog": "catalog",
        "profile": "profile",
        "forum": "forum",
        "about": "about"
    },
    views:{},
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
            if(viewName.indexOf('-')==-1){
                this[viewAction](viewAction, id);
            }
            console.log('viewAction - ' + this[viewAction]);
            $('li>a[set]').parent().removeClass('active');
            $('li>a[set="'+viewName+'"]').parent().addClass('active');
            $('.view').hide();
            $('[set="'+viewName+'"].view').show();
        }
    },
    home: function(viewName){
/*
        var view = this.views[viewName];
        if(!view){
            view = new LargeIconsView({model:{list:[]}});
            this.views[viewName] = view;
            $('[set="'+viewName+'"].view').html(view.render().el);
        }
        else{
            console.info('Use runtime-cached template ['+ viewName + '] for view rendering.');
        }
*/
    },
    my: function(viewName){
/*
        var view = this.views[viewName];
        if(!view){
            view = new MediumIconsView({model:{list:[]}});
            this.views[viewName] = view;
            $('[set="'+viewName+'"].view').html(view.render().el);
        }
        else{
            console.info('Use runtime-cached template ['+ viewName + '] for view rendering.');
        }
*/
    },
    catalog: function(viewName){
        $.getJSON('public/dummy/newest.js',{}, function(list, textStatus){
            view = new LargeIconsView({model:{list: list}});
            var content = '[set="'+viewName+'"].view .content';
            $(content).html( view.render().el );
        });
    },
    catalogNewest: function(viewName){
        viewName = 'catalog';
        this.switchView(viewName);
//        $.ajaxSetup({"error":function(XMLHttpRequest,textStatus, errorThrown) {
//            alert(textStatus);
//            alert(errorThrown);
//            alert(XMLHttpRequest.responseText);
//        }});
        $.getJSON('public/dummy/newest.js',{}, function(data, textStatus){
            var list = data;//eval(data);
            view = new LargeIconsView({model:{list: list}});
            //alert(view.render().$el.html());
            //view.render().el
            var content = '[set="'+viewName+'"].view .content';
            $(content).html( view.render().$el.html() );
        });

//        $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?',{
//            tags: "mount rainier",
//            tagmode: "any",
//            format: "json"
//        }, function(data, textStatus){
//            alert('baidu');
//        });
    },
    catalogHottest: function(viewName){
        viewName = 'catalog';
        this.switchView(viewName);
        $.getJSON('public/dummy/hottest.js',{}, function(list, textStatus){
            view = new LargeIconsView({model:{list: list}});
            var content = '[set="'+viewName+'"].view .content';
            $(content).html( view.render().el );
        });
    },
    catalogSelfrun: function(viewName){
        viewName = 'catalog';
        this.switchView(viewName);
        $.getJSON('public/dummy/selfrun.js',{}, function(list, textStatus){
            view = new LargeIconsView({model:{list: list}});
            var content = '[set="'+viewName+'"].view .content';
            $(content).html( view.render().el );
        });
    },
    profile: function(viewName){
    },
    forum: function(viewName){
    },
    about: function(viewName){
    }
});

$(document).ready(function(){
    var workspace = null;
    tm.loadTemplates(['large-icons', 'medium-icons', 'list-items'], function() {
        workspace = new Workspace();
        Backbone.history.start({pushState: true, hashChange: true});
    });
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