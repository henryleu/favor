define(['Underscore', 'Backbone', 'jQuery', 'JST'], function(_, bb, $, JST) {
    window.tl = window.tl || {};
    var noop = function(){};
    console = console || {log: noop, info: noop, warn: noop, debug: noop, error: noop};

    _apply = function(t, s) {
        for (var k in s) {
            if(!t[k]){
                t[k] = s[k];
            }
        }
    };

    var spaOptions = ['templates'];
    var spa = window.tl.spa = bb.Router.extend({
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
            this.tm = new TemplateManager();
            _apply(this, this.defaults());
            _apply(this, _.pick(options, spaOptions));
            this.configure.apply(this, arguments);
            //bind route events for google analytics
            this.bind('route', this.trackPageview);
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
        },
        trackPageview: function() {
            var url = Backbone.history.getFragment();
            if (!/^\//.test(url)) url = '/' + url;
            ga('send', {
                'hitType': 'pageview',
                'page': url
            });
            console.log('send pageview - ' + url);
        }
    });

    var Model = spa.Model = bb.Model.extend({
    });

    var Collection = spa.Collection = bb.Collection.extend({
        initialize: function(){
            this.cid = _.uniqueId('c');
            this.configure.apply(this, arguments);
        },
        configure: function(){}
    });

    var viewOptions = ['spa', 'hidden', 'modelDriven', 'prerendered', 'templateName', 'vid' ];
    var View = spa.View = bb.View.extend({
        //spa: null, //spa: the central application object
        //children: null, //child registry
        //parent: null,
        //hidden: false,
        //modelDriven: true,
        //prerendered: false,
        //rendered: false,
        //templateName: null, //template name
        //template: null,  //template compiled function
        //vid: '',
        defaults: function (){
            return {
                spa: null,
                children: {},
                parent: null,
                hidden: false,
                modelDriven: true,
                prerendered: true,
                rendered: false,
                templateName: '',
                template: null,
                vid: ''
            }
        },
        initialize: function(options){
            _apply(this, this.defaults());
            _apply(this, _.pick(options, viewOptions));
            this.configure.apply(this, arguments);
            if(this.prerendered){
                this.doRender();
            }
        },
        configure: function(){},
        getId: function(){return this.vid;},
        getParent: function(){return this.parent;},
        setParent: function(parent){this.parent = parent;return this;},
        getChild: function(childId){return this.children[childId];},
        getChildren: function(){return this.children;},
        addChild: function(child){
            this.children[child.getId()] = child;
            child.setParent(this);
            return this;
        },
        removeChild: function(childId){
            if(this.children[childId]){
                this.children[childId].setParent(null);
                this.children[childId] = null;
                delete this.children[childId];
            }
            return this;
        },
        render: function(){
            if(!this.rendered){
                this.doRender();
            }
            return this;
        },
        doRender: function(){
            this.ensureTemplate();
            var model = _.result(this, 'model');
//alert(this.modelDriven + ' ' + this.fetched);
//            if(this.modelDriven && !model.fetched){
//                return this;
//            }
            var json = {};
            if(model.toJSON){
                json = model.toJSON();
            }
            $(this.el).html(this.template( {input: json, id: this.getId()} )); //TODO: try to use $el

            this.afterRender();
            this.rendered = true;

            if(this.hidden) this.hide();
            else this.show();

            this.renderChildren();
            this.afterRenderChildren();
            return this;
        },
        ensureTemplate: function(){
            if(!this.template){
                this.template = this.spa.tm.get(this.templateName);
            }
        },
        renderChildren: function(){
            _.each(this.children, function(view, id) {
                this.$('[data-view-id="' + id + '"]').replaceWith(view.el);
            }, this);
        },
        afterRender: function(){},
        afterRenderChildren: function(){},
        show: function(){this.$el.show();this.hidden = false;return this;},
        hide: function(){this.$el.hide();this.hidden = true;return this;},
        isRendered: function(){return this.rendered;},
        isHidden: function(){return this.hidden;}
    });

    var TemplateManager = window.tl.spa.TemplateManager = function(options){
        this.templates = {};
        this.o = {};
        if(options){
            _.extend(this.o, options);
            _.extend(this, _.pick(this.o, 'prefix'));
        }
//        _.extend(this.templates, window['JST']);
        _.extend(this.templates, JST);
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

    return spa;
});
