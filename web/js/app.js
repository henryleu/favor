define(['Spa', 'jQuery'], function(spa, $) {
    var Product = spa.Model.extend({
        urlRoot: 'deal'
    });

    var NewestCatalog = spa.Collection.extend({
        model: Product,
        url: 'public/dummy/newest.js'
    });
    var HottestCatalog = spa.Collection.extend({
        model: Product,
        url: 'public/dummy/hottest.js'
    });
    var SelfrunCatalog = spa.Collection.extend({
        model: Product,
        url: 'public/dummy/selfrun.js'
    });

    var CatalogView = spa.View.extend({
        templateName: 'catalog',
        hidden: false,
        prerendered: true,
        events: {
            'mouseup [href="catalog-newest"]': 'catalogNewest',
            'mouseup [href="catalog-hottest"]': 'catalogHottest',
            'mouseup [href="catalog-selfrun"]': 'catalogSelfrun'
        },
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
        afterRender: function(){
        },
        afterRenderChildren: function(){
        },
        switchView: function(view){
            _.each(this.children, function(v, id){
                v.hide();
            });
            //alert(view.model.fetched);
            view.doRender();
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

    var Favor = spa.extend({
        //templates: ['catalog', 'large-icons', 'medium-icons', 'list-items', 'share-subject'],
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
                fetched: true,
                newest: null,
                hottest: null,
                selfrun: null
            };
            var newestCatalog = new NewestCatalog({});
            newestCatalog.fetch({
                success: function(){
                    newestCatalog.fetched = true;
                }
            });
            this.models['catalog'].newest = newestCatalog;

            var hottestCatalog = new HottestCatalog({});
            hottestCatalog.fetch({
                success: function(){
                    hottestCatalog.fetched = true;
                }
            });
            this.models['catalog'].hottest = hottestCatalog;

            var selfrunCatalog = new SelfrunCatalog({});
            selfrunCatalog.fetch({
                success: function(){
                    selfrunCatalog.fetched = true;
                }
            });
            this.models['catalog'].selfrun = selfrunCatalog;
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
            //        var view = this.views[viewName];
            //        if(!view){
            //             view = new ShareSubjectView();
            //             var content = '[set="'+viewName+'"].view .content';
            //             $(content).html( view.render().el );
            //             this.views[viewName] = view;
            //        }
            //        else{
            //            console.info('Use runtime-cached template ['+ viewName + '] for view rendering.');
            //        }
            var view = this.views[viewName];
            if(!view){
                view = new ShareSubjectView({spa: this, model:{}, modelDriven: false});
                this.views[viewName] = view;
                var content = '[set="'+viewName+'"].view';
                $(content).html( view.el );
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
            this.ensureCatalogView(viewName).show().catalogNewest();
        },
        catalogNewest: function(viewName){
            if(this.models['catalog'].newest.fetched){
                this.switchView('find');
                this.ensureCatalogView('find').show().catalogNewest();
            }
            else{
                var me = this;
                this.models['catalog'].newest.fetch({
                    success: function(){
                        me.models['catalog'].newest.fetched = true;
                        me.switchView('find');
                        me.ensureCatalogView('find').show().catalogNewest();
                    }
                });
            }
        },
        catalogHottest: function(viewName){
            if(this.models['catalog'].hottest.fetched){
                this.switchView('find');
                this.ensureCatalogView('find').show().catalogHottest();
            }
            else{
                var me = this;
                this.models['catalog'].hottest.fetch({
                    success:function(){
                        me.models['catalog'].hottest.fetched = true;
                        me.switchView('find');
                        me.ensureCatalogView('find').show().catalogHottest();
                    }
                });
            }
        },
        catalogSelfrun: function(viewName){
            if(this.models['catalog'].selfrun.fetched){
                this.switchView('find');
                this.ensureCatalogView('find').show().catalogSelfrun();
            }
            else{
                var me = this;
                this.models['catalog'].selfrun.fetch({
                    success:function(){
                        me.models['catalog'].selfrun.fetched = true;
                        me.switchView('find');
                        me.ensureCatalogView('find').show().catalogSelfrun();
                    }
                });
            }
        },
        forum: function(viewName){

        },
        about: function(viewName){},
        ensureCatalogView: function(viewName){
            var view = this.views['catalog'];
            if(!view){
                view = new CatalogView({spa: this, model:this.models['catalog'], modelDriven: false});
                this.views['catalog'] = view;
                var content = '[set="'+viewName+'"].view';
                $(content).html( view.el );
            }
            return view;
        }
    });

    var CatalogListLargeIconsView = spa.View.extend({
        templateName: 'large-icons'
    });

    var ShareSubjectView = spa.View.extend({
        templateName: 'share-subject'
        //    initialize: function() {
        //
        //    },
        //    render: function() {
        //        if(!this.template){
        //            this.template = _.template(favor.tm.get(this.templateName));
        //        }
        //        $(this.el).html(this.template(this.model));
        //        return this;
        //    }
    });

    return Favor;
});