define(['Spa', 'jQuery'], function(spa, $) {
    var Deal = spa.Model.extend({
        urlRoot: '/deal'
    });

    var NewestCatalog = spa.Collection.extend({
        model: Deal,
        url: 'public/dummy/newest.js'
    });
    var HottestCatalog = spa.Collection.extend({
        model: Deal,
        url: 'public/dummy/hottest.js'
    });
    var SelfrunCatalog = spa.Collection.extend({
        model: Deal,
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
            this.selfrunLargeIconsView = new WaterfallView({
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
        share: function(viewName, id){
            var view = this.views[viewName];
            if (!view && id == null) {
                //When first access
                var deal = new Deal();
                deal.id = '0';
                deal.sDesc = 'test';
                view = new ShareSubjectView({spa: this, model:deal, modelDriven: false});
                this.views[viewName] = view;
                var content = '[set="' + viewName + '"].view';
                $(content).html(view.el);
            } else {

            }
            if(!(id == null)) {
                console.log('Share dealId=' + id);
                view.loadDealInfo(id);
                view.useRemoteImage();
            }
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

    var WaterfallView = spa.View.extend({
        templateName: 'waterfall'
    });

    var CatalogListLargeIconsView = spa.View.extend({
        templateName: 'large-icons'
    });

    var ShareSubjectView = spa.View.extend({
        templateName: 'share-subject',
        prerendered: true,
        events: {
            'change #imageExtLink': 'changeImageExtLink',
            'change #shortDes': 'changeShortDes',
            'change #longDes': 'changeLongDes',
            'change #dealLink': 'changeDealLink',
            'keyup #imageExtLink': 'changeImageExtLink',
            'keyup #shortDes': 'changeShortDes',
            'keyup #longDes': 'changeLongDes',
            'keyup #dealLink': 'changeDealLink',
            'click #useRemoteImage': 'useRemoteImage',
            'click #useLocalImage': 'useLocalImage',
            'click #saveImageLinkSetting': 'saveImageLinkSetting',
            'click #publishDealInfo': 'publishDealInfo',
            'click #clearDealInfo': 'clearDealInfo'
        },
        configure: function() {
            //Todo: add initialize process for model
        },
        afterRender: function() {
            var model = this.model;
            model.set('image', '');
            //Initialize file upload plugin
            this.$('#imageFile').fileupload({
                url: '/files/',
                dataType: 'json',
                add: function (e, data) {
                    $('#fileName').html(data.files[0].name);
                    data.submit();
                },
                done: function (e, data) {
                    var imageURL = '/files/' + data.files[0].name;
                    $('#previewImg').attr('src', imageURL);
                    model.set('image', imageURL);
                    $('#localImageContainer').removeClass('error');
                }
            }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');
        },
        useRemoteImage: function() {
            $('#remoteImageLinkContainer').show();
            $('#useRemoteImageLink').hide();
            $('#localImageContainer').hide();
            $('#useLocalImageLink').show();
        },
        useLocalImage: function() {
            $('#remoteImageLinkContainer').hide();
            $('#useRemoteImageLink').show();
            $('#localImageContainer').show();
            $('#useLocalImageLink').hide();
        },
        changeImageExtLink: function() {
            //Regular expression for test user input url of image
            var reg = /^http:\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*)*\.(jpg|jpeg|png|gif)$/;

            var imageURL = $('#imageExtLink').val();
            var isValidURL = false;
            if (reg.test(imageURL)) {
                isValidURL = true;
            }
            if (isValidURL) {
                $('#previewImg').attr('src', imageURL);
                this.model.set('image', imageURL);
                $('#remoteImageLinkContainer').removeClass('error');
            } else {
                $('#remoteImageLinkContainer').addClass('error');
            }
        },
        changeShortDes: function() {
            var sDesc = $('#shortDes').val();
            if (sDesc.length > 0) {
                $('#previewSDes').html(sDesc);
                this.model.set('sDesc', sDesc);
                $('#shortDesContainer').removeClass('error');
            } else {
                $('#shortDesContainer').addClass('error');
            }
        },
        changeLongDes: function() {
            var lDesc = $('#longDes').val();
            if (lDesc.length > 0) {
                $('#previewLDes').html(lDesc);
                this.model.set('lDesc', lDesc);
                $('#longDesContainer').removeClass('error');
            } else {
                $('#longDesContainer').addClass('error');
            }
        },
        changeDealLink: function() {
            //Regular expression for test user input url of image
            var reg = /^(http|https):\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*)*$/;

            var url = $('#dealLink').val();
            if (reg.test(url)) {
                $('#previewLink').attr('href', 'javascript: window.open(\'' + url + '\');');
                this.model.set('dUrl', url);
                $('#dealLinkContainer').removeClass('error');
            } else {
                $('#previewLink').attr('href', '/share');
                $('#dealLinkContainer').addClass('error');
            }
        },
        publishDealInfo: function() {
            var errFlag = false;
            var imageURL = this.model.get('image');
            if (imageURL.length == 0) {
                $('#remoteImageLinkContainer').addClass('error');
                //$('#localImageContainer').addClass('error');
                errFlag = true;
            }
            if (!($('#shortDes').val().length > 0)) {
                $('#shortDesContainer').addClass('error');
                errFlag = true;
            }
            if (!($('#longDes').val().length > 0)) {
                $('#longDesContainer').addClass('error');
                errFlag = true;
            }
            if (!($('#dealLink').val().length > 0)) {
                $('#dealLinkContainer').addClass('error');
                errFlag = true;
            }
            if (errFlag) return;
            console.log($('.error').length);
            if ($('.error').length > 0) return;
            console.log(JSON.stringify(this.model));
            Backbone.sync('create', this.model, {
                error: function(response, flag) {
                    console.log(JSON.stringify(response));
                    console.log(flag);
                    $('#errorMsg').show();
                },
                success: function(response, flag) {
                    console.log(JSON.stringify(response));
                    console.log(flag);
                    var deal = JSON.parse(JSON.stringify(response));
                    console.log(deal.dealId);
                    $('#editDeal').attr('href', '/share/' + deal.dealId);
                    $('#successMsg').show();
                }
            });
            this.clearDealInfo();
        },
        clearDealInfo: function() {
            $('#imageExtLink').val('');
            $('#shortDes').val('');
            $('#longDes').val('');
            $('#dealLink').val('');
            $('#previewImg').attr('src', '#');
            $('#previewLink').attr('href', '/share');
        },
        loadDealInfo: function(dealId) {
            this.model.id = dealId;
            var model = this.model;
            Backbone.sync('read', this.model, {
                error: function(response, flag) {
                    console.log(JSON.stringify(response));
                    console.log(flag);
                    $('#errorMsg').show();
                },
                success: function(response, flag) {
                    console.log(JSON.stringify(response));
                    console.log(flag);
                    JSON.parse(JSON.stringify(response), function(key, value) {
                        switch(key) {
                            case 'image':
                                $('#imageExtLink').val(value);
                                break;
                            case 'sDesc':
                                $('#shortDes').val(value);
                                break;
                            case 'lDesc':
                                $('#longDes').val(value);
                                break;
                            case 'dUrl':
                                $('#dealLink').val(value);
                                break;
                            default:
                                break;
                        }
                    });
                    $('#successMsg').hide();
                }
            });
        }
    });

    return Favor;
});