/*! Tomato Labs webapp main js */
/**
 * Created with JetBrains WebStorm.
 * User: henryleu
 * Date: 13-7-3
 * Time: 下午5:48
 * To change this template use File | Settings | File Templates.
 */
(function(_, bb, $){
    window.tl = window.tl || {};
    var noop = function(){};
    console = console || {
        log: noop,
        info: noop,
        warn: noop,
        debug: noop,
        error: noop
    }
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
        },
        configure: function(){},
        startup: function(){
            var me = this;
            this.tm.loadTemplates(this.templates, function(){
                me.navigate();
                bb.history.start({pushState: true, hashChange: true});
            });
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
//    spa.extend = bb.Router.extend;

    var Model = spa.Model = bb.Model.extend({
    });
//    Model.extend = bb.Model.extend;

    var Collection = spa.Collection = bb.Collection.extend({
        initialize: function(){
            this.cid = _.uniqueId('c');
            this.configure.apply(this, arguments);
        },
        configure: function(){}
    });
//    Collection.extend = bb.Collection.extend;

    var viewOptions = ['spa', 'hidden', 'prerendered', 'templateName', 'vid' ];
    var View = spa.View = bb.View.extend({
        //spa: null, //spa: the central application object
        //children: null, //child registry
        //parent: null,
        //hidden: false,
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
            var json = {};
            if(model.toJSON){
                json = model.toJSON();
            }
            $(this.el).html(this.template( {input: json, id: this.getId()} )); //TODO: try to use $el
            this.rendered = true;

            if(this.hidden) this.hide();
            else this.show();

            this.renderChildren();
            return this;
        },
        ensureTemplate: function(){
            if(!this.template){
                this.template = _.template(this.spa.tm.get(this.templateName));
            }
        },
        renderChildren: function(){
            _.each(this.children, function(view, id) {
                this.$('[data-view-id="' + id + '"]').replaceWith(view.el);
            }, this);
        },
        show: function(){this.$el.show();this.hidden = false;return this;},
        hide: function(){this.$el.hide();this.hidden = true;return this;},
        isRendered: function(){return this.rendered;},
        isHidden: function(){return this.hidden;}
    });
    View.extend = bb.View.extend;

    var TemplateManager = window.tl.spa.TemplateManager = function(options){
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

})(_, Backbone, jQuery);
var tl = window.tl;

var Product = tl.spa.Model.extend({
    urlRoot: 'product'
});

var NewestCatalog = tl.spa.Collection.extend({
    model: Product,
    url: 'public/dummy/newest.js'
});
var HottestCatalog = tl.spa.Collection.extend({
    model: Product,
    url: 'public/dummy/hottest.js'
});
var SelfrunCatalog = tl.spa.Collection.extend({
    model: Product,
    url: 'public/dummy/selfrun.js'
});

var CatalogView = tl.spa.View.extend({
    templateName: 'catalog',
    hidden: false,
    prerendered: true,
    events: {
        'mouseup [href="catalog-newest"]': 'catalogNewest',
        'mouseup [href="catalog-hottest"]': 'catalogHottest',
        'mouseup [href="catalog-selfrun"]': 'catalogSelfrun'
    },
//    events:{
//        "catalog-newest?view=large-icons": "catalogNewest",
//        "catalog-hottest?view=large-icons": "catalogHottest",
//        "catalog-selfrun?view=large-icons": "catalogSelfrun"
//    },
    configure: function(){
        this.newestLargeIconsView = new CatalogListLargeIconsView({
            vid: 'catalog-newest',
            spa: this.spa,
            prerendered: true,
            model: this.model.newest
        });
        this.hottestLargeIconsView = new CatalogListLargeIconsView({
            vid: 'catalog-hottest',
            spa: this.spa,
            prerendered: true,
            model: this.model.hottest
        });
        this.selfrunLargeIconsView = new CatalogListLargeIconsView({
            vid: 'catalog-selfrun',
            spa: this.spa,
            prerendered: true,
            model: this.model.selfrun
        });
        this.addChild(this.newestLargeIconsView);
        this.addChild(this.hottestLargeIconsView);
        this.addChild(this.selfrunLargeIconsView);
    },
    switchView: function(view){
        _.each(this.children, function(v, id){
            v.hide();
        });
        view.show();
    },
    catalogNewest: function(){
        this.switchView(this.newestLargeIconsView);
    },
    catalogHottest: function(){
        this.switchView(this.hottestLargeIconsView);
    },
    catalogSelfrun: function(){
        this.switchView(this.selfrunLargeIconsView);
    }
});

var Favor = tl.spa.extend({
    templates: ['catalog', 'large-icons', 'medium-icons', 'list-items', 'share-subject'],
    routes: {
        "catalog-newest": "catalogNewest",
        "catalog-hottest": "catalogHottest",
        "catalog-selfrun": "catalogSelfrun",
        "*view(/:id)": "switchView",
        "home": "home",
        "share": "share",
        "find": "find",
        "forum": "forum",
        "about": "about"
    },
    root: '/',
    defaultUri: 'home',
    configure: function(){
        this.models['catalog'] = {
            newest: null,
            hottest: null,
            selfrun: null
        };
        var col;
        col = new NewestCatalog({});
        col.fetch();
        this.models['catalog'].newest = col;

        col = new HottestCatalog({});
        col.fetch();
        this.models['catalog'].hottest = col;

        col = new SelfrunCatalog({});
        col.fetch();
        this.models['catalog'].selfrun = col;
    },
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
            $('li>a[set]').parent().removeClass('active');
            $('li>a[set="'+viewName+'"]').parent().addClass('active');
            $('.view').hide();
            $('[set="'+viewName+'"].view').show();
        }
    },
    home: function(viewName){
    },
    share: function(viewName){
        var view = this.views[viewName];
        if(!view){
             view = new ShareSubjectView();
             var content = '[set="'+viewName+'"].view .content';
             $(content).html( view.render().el );
             this.views[viewName] = view;
        }
        else{
            console.info('Use runtime-cached template ['+ viewName + '] for view rendering.');
        }
        $('#imageFile').fileupload({
            url: '/files/',
            dataType: 'json',
            add: function (e, data) {
                $('#fileName').html(data.files[0].name);
                data.submit();
            },
            done: function (e, data) {
                $('#previewImg').attr('src', '/files/' + data.files[0].name);
            }
        }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');
        $('#productLink').bind('change', function() {
            var url = $('#productLink').val();
            if (url.length > 0) {
                $('#previewLink').attr('href', 'javascript: window.open(\'' + url + '\');');
            } else {
                $('#previewLink').attr('href', '/share');
            }
        }).change();
        $('#shortDes').bind('change keyup', function() {
            $('#previewSDes').html($('#shortDes').val());
        }).change();
        $('#longDes').bind('change keyup', function() {
            $('#previewLDes').html($('#longDes').val());
        }).change();
        $('#saveImageLink').bind('click', function() {
            var imageLink = $('#imageLink').val();
            if (imageLink.length > 0) {
                $('#fileName').html($('#imageLink').val());
                $('#previewImg').attr('src', $('#imageLink').val());
                $('#myModal').modal('hide');
            }
        }).click();
    },
    find: function(viewName){
        this.ensureCatalogView(viewName).show();
/*
        $.getJSON('public/dummy/newest.js',{}, function(list, textStatus){
            view = new LargeIconsView({model:{input: list, id: 'newest'}});
            var content = '[set="'+viewName+'"].view .content';
            $(content).html( view.render().el );
        });
*/
    },
    catalogNewest: function(viewName){
        this.switchView('find');
        this.ensureCatalogView(viewName).show().catalogNewest();
    },
    catalogHottest: function(viewName){
        this.switchView('find');
        this.ensureCatalogView(viewName).show().catalogHottest();
    },
    catalogSelfrun: function(viewName){
        this.switchView('find');
        this.ensureCatalogView(viewName).show().catalogSelfrun();
    },
    forum: function(viewName){

    },
    about: function(viewName){},
    ensureCatalogView: function(viewName){
        var view = this.views['catalog'];
        if(!view){
            view = new CatalogView({spa: this, model:this.models['catalog']});
            this.views['catalog'] = view;
            var content = '[set="'+viewName+'"].view';
            $(content).html( view.el );
        }
        return view;
    }
});
var favor = null;

var CatalogListLargeIconsView = tl.spa.View.extend({
    templateName: 'large-icons'
});

//var tm = new TemplateManager();
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
            this.template = _.template(favor.tm.get(this.templateName));
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
            this.template = _.template(favor.tm.get(this.templateName));
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
var ShareSubjectView = Backbone.View.extend({
    templateName: 'share-subject',
    initialize: function() {

    },
    render: function() {
        if(!this.template){
            this.template = _.template(favor.tm.get(this.templateName));
        }
        $(this.el).html(this.template(this.model));
        return this;
    }
});
$(document).ready(function(){
    favor = new Favor({
    });
    favor.startup();
});