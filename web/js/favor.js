define(['Spa', 'jQuery'], function(spa, $) {
    var Deal = spa.Model.extend({
        idAttribute: '_id',
        urlRoot: '/deal',
        defaults: {
            '_id': 0,
            'image': '',
            'sDesc': '',
            'lDesc': '',
            'dUrl': '',
            'actionType': '',
            'lastDealId': 0
        },
        clear: function() {
            this.set('_id', 0);
            this.set('image', '');
            this.set('sDesc', '');
            this.set('lDesc', '');
            this.set('dUrl', '');
            this.set('actionType', '');
            this.set('lastDealId', 0);
        }
    });

    var NewestCatalog = spa.Collection.extend({
        model: Deal,
        url: '/newestDeals'
    });
    var HottestCatalog = spa.Collection.extend({
        model: Deal,
        url: '/hottestDeals'
    });
    var SelfrunCatalog = spa.Collection.extend({
        model: Deal,
        url: '/allDeals'
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
            "showDeal": "showDeal",
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

            this.configureViews();
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
            if (!view) {
                //When first access
                view = new ShareSubjectView({spa: this, modelDriven: false});
                this.views[viewName] = view;
                var content = '[set="' + viewName + '"].view';
                $(content).html(view.el);
            }
            if(!(id == null)) {
                view.loadDealInfo(id);
            }
        },
        showDeal: function(viewName, id) {
            var view = this.views[viewName];
            if (!view) {
                //When first access
                view = new ShowDealView({spa: this, modelDriven: false});
                this.views[viewName] = view;
                var content = '[set="' + viewName + '"].view';
                $(content).html(view.el);
            }
            if(!(id == null)) {
                view.viewDeal(id);
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
        },
        configureViews: function(){
            $('ul li.message a').mouseup(function(){
                var p = $(this).parent();
                if(p.hasClass('active')){
                    p.removeClass('active');
                }
                else{
                    p.addClass('active');
                }
            });
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
        events: {
            'change #imageURL': 'changeImageURL',
            'change #shortDes': 'changeShortDes',
            'change #longDes': 'changeLongDes',
            'change #dealLink': 'changeDealLink',
            'keyup #imageURL': 'changeImageURL',
            'keyup #shortDes': 'changeShortDes',
            'keyup #longDes': 'changeLongDes',
            'keyup #dealLink': 'changeDealLink',
            'click #uploadLocalImage': 'uploadLocalImage',
            'click #saveImageLinkSetting': 'saveImageLinkSetting',
            'click #publishDealInfo': 'publishDealInfo',
            'click #updateDealInfo': 'updateDealInfo',
            'click #deleteDealInfo': 'deleteDealInfo',
            'click #clearDealInfo': 'clearDealInfo',
            'click #abandonChange': 'abandonChange'
        },
        configure: function() {
            this.model = new Deal();
            this.model.set('_id', 0);
            this.uploadingImage = false;
        },
        afterRender: function() {
            var thisView = this;
            //Initialize file upload plugin
            this.$('#imageFile').fileupload({
                url: '/files/',
                dataType: 'json',
                timeout: 20000,
                error: function(xhr, status, e) {
                    alert('抱歉，上传失败。你选择的图片可能过大，或者因为网络状况上传超时。\n以下是内部错误信息：\n' + xhr.status + ' ' + e.toString());
                },
                add: function(e, data) {
                    $('#uploadIcon').removeClass('icon-picture');
                    $('#uploadIcon').addClass('icon-spinner icon-spin');
                    thisView.uploadingImage = true;
                    $('#fileName').html(data.files[0].name);
                    data.submit();
                },
                done: function(e, data) {
                    var imageURL = 'http://' + location.hostname + '/files/' + data.files[0].name;
                    $('#previewImg').attr('src', imageURL);
                    $('#imageURL').val(imageURL);
                    thisView.model.set('image', imageURL);
                    $('#imageURLContainer').removeClass('error');
                },
                always: function(e, data) {
                    $('#uploadIcon').removeClass('icon-spinner icon-spin');
                    $('#uploadIcon').addClass('icon-picture');
                    thisView.uploadingImage = false;
                }
            }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');
        },
        uploadLocalImage: function() {
            if (this.uploadingImage == true) return;
            $('#imageFile').click();
        },
        changeImageURL: function() {
            //Regular expression for test user input url of image
            var reg = /^http:\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*)*\.(jpg|jpeg|png|gif)$/;

            var imageURL = $('#imageURL').val();
            var isValidURL = false;
            if (reg.test(imageURL)) {
                isValidURL = true;
            }
            if (isValidURL) {
                $('#previewImg').attr('src', imageURL);
                this.model.set('image', imageURL);
                $('#imageURLContainer').removeClass('error');
            } else {
                $('#imageURLContainer').addClass('error');
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
            if (!this.isFulfilled()) return;
            var thisView = this;
            thisView.model.id = '';
            Backbone.sync('create', thisView.model, {
                error: function(response, flag) {
                    console.log('Error occurred in creating deal. -> ' + JSON.stringify(response));
                    $('#errorMsg').show();
                },
                success: function(response, flag) {
                    thisView.model.clear();
                    console.log('Published deal: ' + JSON.stringify(response));
                    var deal = JSON.parse(JSON.stringify(response));
                    thisView.model.set('lastDealId', deal._id);
                    thisView.doRender();
                    $('#successMsg').show();
                }
            });
        },
        updateDealInfo: function() {
            if (!this.isFulfilled()) return;
            var thisView = this;
            thisView.model.set('actionType', 'update');
            Backbone.sync('update', thisView.model, {
                error: function(response, flag) {
                    console.log('Error occurred in updating deal. -> ' + JSON.stringify(response));
                    $('#errorMsg').show();
                },
                success: function(response, flag) {
                    thisView.model.clear();
                    console.log('Updated deal: ' + JSON.stringify(response));
                    var deal = JSON.parse(JSON.stringify(response));
                    thisView.model.set('lastDealId', deal._id);
                    thisView.doRender();
                    $('#successMsg').show();
                }
            });
        },
        deleteDealInfo: function() {
            var thisView = this;
            Backbone.sync('delete', thisView.model, {
                error: function(response, flag) {
                    console.log('Error occurred in deleting deal. -> ' + JSON.stringify(response));
                    $('#errorMsg').show();
                },
                success: function(response, flag) {
                    thisView.model.clear();
                    thisView.doRender();
                    console.log('Deleted deal: ' + JSON.stringify(response));
                    $('#successMsg').show();
                }
            });
        },
        clearDealInfo: function() {
            this.model.set('image', '');
            this.model.set('sDesc', '');
            this.model.set('lDesc', '');
            this.model.set('dUrl', '');
            this.doRender();
        },
        abandonChange: function() {
            this.model.clear();
            this.doRender();
        },
        isFulfilled: function() {
            if ($('#imageURL').val().length == 0) {
                $('#imageURLContainer').addClass('error');
            }
            if (!($('#shortDes').val().length > 0)) {
                $('#shortDesContainer').addClass('error');
            }
            if (!($('#longDes').val().length > 0)) {
                $('#longDesContainer').addClass('error');
            }
            if (!($('#dealLink').val().length > 0)) {
                $('#dealLinkContainer').addClass('error');
            }
            if ($('.error').length > 0) {
                return false;
            } else {
                return true;
            }
        },
        loadDealInfo: function(dealId) {
            var thisView = this;
            thisView.model.id = dealId;
            Backbone.sync('read', thisView.model, {
                error: function(response, flag) {
                    console.log('Error occurred in loading deal. -> ' + JSON.stringify(response));
                    $('#errorMsg').show();
                },
                success: function(response, flag) {
                    console.log(JSON.stringify(response));
                    JSON.parse(JSON.stringify(response), function(key, value) {
                        thisView.model.set(key, value);
                    });
                    Backbone.history.navigate('share');
                    thisView.doRender();
                    $('#successMsg').hide();
                }
            });
        }
    });

    var ShowDealView = spa.View.extend({
        templateName: 'show-deal',
        events: {
            'click #likeDeal': 'likeDeal',
            'click #ownDeal': 'ownDeal'
        },
        configure: function() {
            this.model = new Deal();
            var meta = new function(){};
            meta.views = 0;
            meta.likes = 0;
            meta.owns = 0;
            meta.deals = 0;
            this.model.set('meta', meta);
        },
        dealAttrReviver: function(view, key, value) {
            var reg, dt;
            if (typeof value === 'string') {
                reg = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                if (reg) {
                    dt = new Date(Date.UTC(+reg[1], +reg[2] - 1, +reg[3], +reg[4], +reg[5], +reg[6]));
                    value = dt.toString('yyyy-MM-dd HH:mm:ss');
                }
            }
            var meta = view.model.get('meta');
            switch(key) {
                case 'views':
                    meta.views = value;
                    break;
                case 'likes':
                    meta.likes = value;
                    break;
                case 'owns':
                    meta.owns = value;
                    break;
                case 'deals':
                    meta.deals = value;
                    break;
                case 'meta':
                    break;
                default:
                    view.model.set(key, value);
                    break;
            }
        },
        likeDeal: function() {
            this.loadDealInfo('like');
        },
        ownDeal: function() {
            this.loadDealInfo('own');
        },
        viewDeal: function(dealId) {
            this.model.id = dealId;
            this.loadDealInfo('view');
        },
        loadDealInfo: function(actionType) {
            var thisView = this;
            thisView.model.set('actionType', actionType);
            Backbone.sync('update', thisView.model, {
                error: function(response, flag) {
                    console.log('Error occurred in loading deal. -> ' + JSON.stringify(response));
                    alert('Failed to show deal: ' + dealId);
                },
                success: function(response, flag) {
                    console.log(JSON.stringify(response));
                    JSON.parse(JSON.stringify(response), function(key, value) {
                        thisView.dealAttrReviver(thisView, key, value);
                    });
                    thisView.doRender();
                }
            });
        }
    });

    return Favor;
});