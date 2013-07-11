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
    templates: ['catalog', 'large-icons', 'medium-icons', 'list-items'],
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
$(document).ready(function(){
    favor = new Favor({
    });
    favor.startup();
});