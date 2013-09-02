define(['Spa', 'jQuery'], function(spa, $) {
    var Deal = spa.Model.extend({
        idAttribute: '_id',
        urlRoot: '/deal'
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
            'mouseup [href="catalog-selfrun"]': 'catalogSelfrun',
            'mouseover .floatButton': 'onMouseoverButton',
            'mouseleave .floatButton': 'onMouseleaveButton',
            'click #refreshAll': 'refetchAll',
            'hidden #myModal': 'refetchAll'
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

            //Initialize dealDetailView
            this.dealDetailView = new ShowDealView({
                vid: 'dealDetail',
                spa: this.spa,
                model: this.model.curDeal
            });
            this.selfrunLargeIconsView.dealView = this.dealDetailView;
            var me = this;
            this.listenTo(this.dealDetailView, 'dataLoaded', function() {
                $('#myModal').modal();
            });
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
        },
        refetchAll: function() {
            console.debug('Start refetchAll...');
            var me = this;
            this.model.newest.fetch({
                success: function(){
                    me.model.newest.fetched = true;
                    me.newestLargeIconsView.doRender();
                    console.debug('Newest rendered.');
                }
            });
            this.model.hottest.fetch({
                success: function(){
                    me.model.hottest.fetched = true;
                    me.hottestLargeIconsView.doRender();
                    console.debug('Hottest rendered.');
                }
            });
            this.model.selfrun.fetch({
                success: function(){
                    me.model.selfrun.fetched = true;
                    me.selfrunLargeIconsView.doRender();
                    console.debug('Selfrun rendered.');
                }
            });
        },
        onMouseoverButton: function(event) {
            $(event.currentTarget).removeClass('btn-link');
        },
        onMouseleaveButton: function(event) {
            $(event.currentTarget).addClass('btn-link');
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
                selfrun: null,
                curDeal: null
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

            this.models['catalog'].curDeal = new Deal();

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
                var deal = new Deal();
                view = new ShareSubjectView({spa: this, model: deal, modelDriven: false});
                this.views[viewName] = view;
                var content = '[set="' + viewName + '"].view';
                $(content).html(view.el);
                //Let Catalog view to listen the sync event of share model
                if (!this.views['catalog']) {
                    this.ensureCatalogView('find');
                }
                var catalogView = this.views['catalog'];
                this.views['catalog'].listenTo(this.views['share'].model, 'sync', function() {
                    catalogView.refetchAll();
                });
            }
            if(!(id == null)) {
                view.loadDealInfo(id);
            }
        },
        showDeal: function(viewName, id) {
            var view = this.views[viewName];
            if (!view) {
                //When first access
                var deal = new Deal();
                view = new ShowDealView({spa: this, model: deal, modelDriven: false});
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
                $('#myModal').html(view.dealDetailView.el);
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
        templateName: 'waterfall',
        events: {
            'click .thing': 'onClickItem'
        },
        onClickItem: function(event) {
            this.dealView.viewDeal($(event.currentTarget).attr('dealId'));
        }
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
            'click #abandonChange': 'clearDealInfo'
        },
        configure: function() {
            var me = this;
            this.uploadingImage = false;
            this.listenTo(this.model, 'sync', function(model, resp, options) {
                console.debug('ShareSubjectView sync event callback: ' + me.syncMethod);
                switch(me.syncMethod) {
                    case 'create':
                    case 'update':
                        me.model.clear();
                        console.log('Successfully ' + me.syncMethod + ': ' + JSON.stringify(resp));
                        var deal = JSON.parse(JSON.stringify(resp));
                        me.model.set('lastDealId', deal._id);
                        me.doRender();
                        $('#successMsg').show();
                        break;
                    case 'delete':
                        me.clearDealInfo();
                        console.log('Successfully delete: ' + JSON.stringify(resp));
                        $('#successMsg').show();
                        break;
                    case 'read':
                        console.log('Successfully read: ' + JSON.stringify(resp));
                        JSON.parse(JSON.stringify(resp), function(key, value) {
                            me.model.set(key, value);
                        });
                        Backbone.history.navigate('share');
                        me.doRender();
                        $('#successMsg').hide();
                        break;
                    default:
                        break;
                }
            });
            this.listenTo(this.model, 'error', function(model, xhr, options) {
                console.log('Error occurred when ' + me.syncMethod + ' deal. -> ' + JSON.stringify(xhr));
                $('#errorMsg').show();
            });
        },
        afterRender: function() {
            var me = this;
            //Initialize file upload plugin
            this.$('#imageFile').fileupload({
                url: '/files/',
                dataType: 'json',
                timeout: 30000,
                error: function(xhr, status, e) {
                    alert('抱歉，上传失败。你选择的图片可能过大，或者因为网络状况上传超时。\n以下是内部错误信息：\n' + xhr.status + ' ' + e.toString());
                },
                add: function(e, data) {
                    $('#uploadIcon').removeClass('icon-picture');
                    $('#uploadIcon').addClass('icon-spinner icon-spin');
                    me.uploadingImage = true;
                    $('#fileName').html(data.files[0].name);
                    data.submit();
                },
                done: function(e, data) {
                    var imageURL = 'http://' + location.hostname + '/files/' + data.files[0].name;
                    $('#previewImg').attr('src', imageURL);
                    $('#imageURL').val(imageURL);
                    me.model.set('image', imageURL);
                    $('#imageURLContainer').removeClass('error');
                },
                always: function(e, data) {
                    $('#uploadIcon').removeClass('icon-spinner icon-spin');
                    $('#uploadIcon').addClass('icon-picture');
                    me.uploadingImage = false;
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
            //Regular expression for test user input url
            //var reg = /^(http|https):\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*)*$/;
            var reg = /^(http|https):\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\//;

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
            this.syncMethod = 'create';
            this.model.save();
        },
        updateDealInfo: function() {
            if (!this.isFulfilled()) return;
            this.model.set('actionType', 'update');
            this.syncMethod = 'update';
            this.model.save();
        },
        deleteDealInfo: function() {
            this.syncMethod = 'delete';
            this.model.destroy();
        },
        clearDealInfo: function() {
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
            this.model.id = dealId;
            this.syncMethod = 'read';
            this.model.fetch();
        }
    });

    var ShowDealView = spa.View.extend({
        templateName: 'show-deal',
        events: {
            'click #likeDeal': 'likeDeal',
            'click #ownDeal': 'ownDeal'
        },
        configure: function() {
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
            var me = this;
            this.model.set('actionType', actionType);
            Backbone.sync('update', this.model, {
                error: function(response, flag) {
                    console.log('Error occurred in loading deal. -> ' + JSON.stringify(response));
                    alert('Failed to show deal: ' + dealId);
                },
                success: function(response, flag) {
                    console.log(JSON.stringify(response));
                    JSON.parse(JSON.stringify(response), function(key, value) {
                        me.dealAttrReviver(me, key, value);
                    });
                    me.doRender();
                    if (actionType == 'view') me.trigger('dataLoaded');
                }
            });
        }
    });

    return Favor;
});