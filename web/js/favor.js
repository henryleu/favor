define(['Spa', 'jQuery'], function(spa, $) {
    //upload server setting for jquery-file-upload, no longer used.
//    var uploadServer = 'http://115.28.3.7';

    //image server URL of UpaiYun
    var imageServer = 'http://favor-image.b0.upaiyun.com';

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
    var RecommendCatalog = spa.Collection.extend({
        model: Deal,
        url: '/recommendDeals'
    });

    var CatalogView = spa.View.extend({
        templateName: 'catalog',
        hidden: false,
        prerendered: true,
        events: {
            'click .largeIconsMode': 'switchToLargeIconsMode',
            'click .waterfallMode': 'switchToWaterfallMode',
            'mouseover .floatButton': 'onMouseoverButton',
            'mouseleave .floatButton': 'onMouseleaveButton',
            'click #refreshAll': 'doRefresh',
            'hide #dealDetailModal': 'refetchAll'
        },
        configure: function() {
            this.newestLargeIconsView = new LargeIconsView({
                vid: 'catalog-newest-largeIcons',
                spa: this.spa,
                prerendered: true,
                model: this.model.newest
            });
            this.hottestLargeIconsView = new LargeIconsView({
                vid: 'catalog-hottest-largeIcons',
                spa: this.spa,
                prerendered: true,
                model: this.model.hottest
            });
            this.recommendLargeIconsView = new LargeIconsView({
                vid: 'catalog-recommend-largeIcons',
                spa: this.spa,
                prerendered: true,
                model: this.model.recommend
            });
            this.newestWaterfallView = new WaterfallView({
                vid: 'catalog-newest-waterfall',
                spa: this.spa,
                prerendered: true,
                model: this.model.newest
            });
            this.hottestWaterfallView = new WaterfallView({
                vid: 'catalog-hottest-waterfall',
                spa: this.spa,
                prerendered: true,
                model: this.model.hottest
            });
            this.recommendWaterfallView = new WaterfallView({
                vid: 'catalog-recommend-waterfall',
                spa: this.spa,
                prerendered: true,
                model: this.model.recommend
            });
            this.addChild(this.newestLargeIconsView);
            this.addChild(this.hottestLargeIconsView);
            this.addChild(this.recommendLargeIconsView);
            this.addChild(this.newestWaterfallView);
            this.addChild(this.hottestWaterfallView);
            this.addChild(this.recommendWaterfallView);

            this.viewMode = 'largeIcons';
            this.subViews = [];
            this.subViews['newest'] = [];
            this.subViews['newest']['largeIcons'] = this.newestLargeIconsView;
            this.subViews['newest']['waterfall'] = this.newestWaterfallView;
            this.subViews['hottest'] = [];
            this.subViews['hottest']['largeIcons'] = this.hottestLargeIconsView;
            this.subViews['hottest']['waterfall'] = this.hottestWaterfallView;
            this.subViews['recommend'] = [];
            this.subViews['recommend']['largeIcons'] = this.recommendLargeIconsView;
            this.subViews['recommend']['waterfall'] = this.recommendWaterfallView;
            this.curViewName = 'newest';
            //Initialize refreshTime
            this.lastRefreshTime = 0;
            //Add listener for models
            this.listenTo(this.model.newest, 'request', this.onRequestFetchModel);
            this.listenTo(this.model.newest, 'sync', this.onSuccessFetchModel);
            this.listenTo(this.model.newest, 'error', this.onErrorFetchModel);
            this.listenTo(this.model.hottest, 'request', this.onRequestFetchModel);
            this.listenTo(this.model.hottest, 'sync', this.onSuccessFetchModel);
            this.listenTo(this.model.hottest, 'error', this.onErrorFetchModel);
            this.listenTo(this.model.recommend, 'request', this.onRequestFetchModel);
            this.listenTo(this.model.recommend, 'sync', this.onSuccessFetchModel);
            this.listenTo(this.model.recommend, 'error', this.onErrorFetchModel);
            //Initialize dealDetailView
            this.dealDetailView = new ShowDealView({
                vid: 'dealDetail',
                spa: this.spa,
                model: this.model.curDeal
            });
            this.newestWaterfallView.dealView = this.dealDetailView;
            this.hottestWaterfallView.dealView = this.dealDetailView;
            this.recommendWaterfallView.dealView = this.dealDetailView;
            var me = this;
            this.listenTo(this.dealDetailView, 'dataLoaded', function() {
                $('#dealDetailModal').modal();
            });
        },
        afterRender: function() {
        },
        afterRenderChildren: function() {
        },
        switchSubView: function() {
            _.each(this.children, function(v, id){
                v.hide();
            });
            var view = this.subViews[this.curViewName][this.viewMode];
            view.doRender();
            view.show();
            this.switchModeButtons();

            //Enable google analytics tracking of switchSubView
//            ga('send', {
//                'hitType': 'event',
//                'eventCategory': this.curViewName + '-' + this.viewMode[this.curViewName],
//                'eventAction': 'click',
//                'eventLabel': 'switch view mode'
//            });
        },
        catalogNewest: function() {
            this.curViewName = 'newest';
            this.switchSubView();
        },
        catalogHottest: function(){
            this.curViewName = 'hottest';
            this.switchSubView();
        },
        catalogRecommend: function(){
            this.curViewName = 'recommend';
            this.switchSubView();
        },
        switchToLargeIconsMode: function() {
            this.viewMode = 'largeIcons';
            this.switchSubView();
        },
        switchToWaterfallMode: function() {
            this.viewMode = 'waterfall';
            this.switchSubView();
        },
        switchModeButtons: function() {
            switch(this.viewMode) {
                case 'largeIcons':
                    $('.largeIconsMode').addClass('active');
                    $('.waterfallMode').removeClass('active');
                    break;
                case 'waterfall':
                    $('.largeIconsMode').removeClass('active');
                    $('.waterfallMode').addClass('active');
                    break;
                default:
                    break;
            }
        },
        doRefresh: function() {
            if (this.refreshCount > 0) {
                console.debug('In refreshing..., need to wait.');
                return;
            }
            var curTime = Date.now();
            if (curTime - this.lastUpdateTime < 30000) {
                console.debug('No need to refresh, only ' + (curTime - this.lastUpdateTime)/1000 + 's passed.');
                return;
            }
            this.refetchAll();
        },
        refetchAll: function() {
            this.lastUpdateTime = Date.now();
            console.debug('Start refetchAll...');
            this.refreshCount = 0;
            $('.icon-refresh').addClass('icon-spin');
            $('#refreshAll').find('span').html(' 刷新中...');
            this.model.newest.fetch();
            this.model.hottest.fetch();
            this.model.recommend.fetch();
        },
        onMouseoverButton: function(event) {
            $(event.currentTarget).removeClass('btn-link');
            $(event.currentTarget).addClass('btn-success');
        },
        onMouseleaveButton: function(event) {
            $(event.currentTarget).removeClass('btn-success');
            $(event.currentTarget).addClass('btn-link');
        },
        onRequestFetchModel: function() {
            this.refreshCount += 1;
        },
        onSuccessFetchModel: function() {
            this.refreshCount -= 1;
            if (this.refreshCount == 0) {
                $('.icon-refresh').removeClass('icon-spin');
                $('#refreshAll').find('span').html(' ');
            }
        },
        onErrorFetchModel: function() {
            this.refreshCount -= 1;
            if (this.refreshCount == 0) {
                $('.icon-refresh').removeClass('icon-spin');
                $('#refreshAll').find('span').html(' ');
            }
        }
    });

    var Favor = spa.extend({
        routes: {
            "catalog-newest": "catalogNewest",
            "catalog-hottest": "catalogHottest",
            "catalog-recommend": "catalogRecommend",
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
                recommend: null,
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

            var recommendCatalog = new RecommendCatalog({});
            recommendCatalog.fetch({
                success: function(){
                    recommendCatalog.fetched = true;
                }
            });
            this.models['catalog'].recommend = recommendCatalog;

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
            this.ensureCatalogView(viewName).show().switchSubView();
        },
        catalogNewest: function(viewName){
            this.switchView('find');
            this.ensureCatalogView('find').show().catalogNewest();
        },
        catalogHottest: function(viewName){
            this.switchView('find');
            this.ensureCatalogView('find').show().catalogHottest();
        },
        catalogRecommend: function(viewName){
            this.switchView('find');
            this.ensureCatalogView('find').show().catalogRecommend();
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
                $('#dealDetailModal').html(view.dealDetailView.el);
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
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                me.model.fetched = true;
                me.doRender();
            });
        },
        onClickItem: function(event) {
            this.dealView.viewDeal($(event.currentTarget).attr('dealId'));
        }
    });

    var LargeIconsView = spa.View.extend({
        templateName: 'large-icons',
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                me.model.fetched = true;
                me.doRender();
            });
        }
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
            'mouseover .floatButton': 'onMouseoverButton',
            'mouseleave .floatButton': 'onMouseleaveButton',
            'click #changeImageMode': 'changeImageMode',
            'click .previewImage': 'uploadLocalImage',
            'click #saveImageLinkSetting': 'saveImageLinkSetting',
            'click #publishDealInfo': 'publishDealInfo',
            'click #updateDealInfo': 'updateDealInfo',
            'click #deleteDealInfo': 'deleteDealInfo',
            'click #clearDealInfo': 'clearDealInfo',
            'click #abandonChange': 'clearDealInfo'
        },
        configure: function() {
            var me = this;
            this.usingLocalImage = true;
            this.uploadingImage = false;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                console.debug('ShareSubjectView sync event callback: ' + me.syncMethod);
                switch(me.syncMethod) {
                    case 'create':
                    case 'update':
                        me.model.clear();
                        console.log('Successfully ' + me.syncMethod + ': ' + JSON.stringify(res));
                        var deal = JSON.parse(JSON.stringify(res));
                        me.doRender();
                        $('.alert-success').show();
                        break;
                    case 'delete':
                        me.clearDealInfo();
                        console.log('Successfully delete: ' + JSON.stringify(res));
                        $('.alert-success').show();
                        break;
                    case 'read':
                        console.log('Successfully read: ' + JSON.stringify(res));
                        JSON.parse(JSON.stringify(res), function(key, value) {
                            me.model.set(key, value);
                        });
                        Backbone.history.navigate('share');
                        me.doRender();
                        $('.alert-success').hide();
                        break;
                    default:
                        break;
                }
            });
            this.listenTo(this.model, 'error', function(model, xhr, options) {
                console.log('Error occurred when ' + me.syncMethod + ' deal. -> ' + JSON.stringify(xhr));
                $('.alert-error').show();
            });
        },
        afterRender: function() {
            var me = this;

            //Initialize file upload plugin 'jquery-file-upload', no longer used.
//            var uploadBaseUrl = uploadServer + '/files/';
//            this.$('#imageFile').fileupload({
//                url: uploadBaseUrl,
//                dataType: 'json',
//                timeout: 30000,
//                error: function(xhr, status, e) {
//                    $('.previewImage').attr('src', imageServer + '/share-alt-image.png');
//                    $('.alert-error').find('strong').html('抱歉，上传失败。');
//                    $('.alert-error').find('span').html('您选择的图片可能过大，或者因为网络状况不佳上传超时。');
//                    $('.alert-error').show();
//                },
//                add: function(e, data) {
//                    $('.previewImage').attr('src', imageServer + '/background.png');
//                    $('.icon-spinner').removeClass('hide');
//                    $('.icon-spinner').addClass('icon-spin');
//                    me.uploadingImage = true;
//                    $('#fileName').html(data.files[0].name);
//                    data.submit();
//                },
//                done: function(e, data) {
//                    $('.alert-error').hide();
//                    var imageURL = uploadBaseUrl + data.result.files[0].name;
//                    $('.previewImage').attr('src', imageURL);
//                    $('#imageURL').val(imageURL);
//                    me.model.set('image', imageURL);
//                    $('#imageURLContainer').removeClass('error');
//                },
//                always: function(e, data) {
//                    $('.icon-spinner').removeClass('icon-spin');
//                    $('.icon-spinner').addClass('hide');
//                    me.uploadingImage = false;
//                }
//            }).prop('disabled', !$.support.fileInput)
//                .parent().addClass($.support.fileInput ? undefined : 'disabled');

            //Enable local image upload to UpaiYun directly
            this.$('#upaiUploadFile').change(function(event) {
                var input = event.currentTarget;
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('.previewImage').attr('src', e.target.result);
                    }
                    reader.readAsDataURL(input.files[0]);
                }
                $(event.currentTarget).upaiUpload(function(result) {
                    console.debug(result);
                    if (result.code != '200') {
                        $('.alert-error').find('strong').html('抱歉，您选择的本地图片上传失败，别人将无法看到该图片。');
                        $('.alert-error').find('span').html('您可以选择其他图片再试。');
                        $('.alert-error').show();
                    } else {
                        $('.alert-error').hide();
                        var imageURL = imageServer + result.url;
                        $('.previewImage').attr('src', imageURL);
                        $('#imageURL').val(imageURL);
                        me.model.set('image', imageURL);
                    }
                })
            });
            if (this.model.get('image') == undefined) {
                this.$('.previewImage').attr('src', 'http://favor-image.b0.upaiyun.com/share-alt-image.png');
            } else {
                this.$('.previewImage').attr('src', this.model.get('image'));
            }
        },
        onMouseoverButton: function(event) {
            $(event.currentTarget).removeClass('btn-link');
            $(event.currentTarget).addClass('btn-success');
            if (this.usingLocalImage == true) {
                $(event.currentTarget).html('图片链接');
            } else {
                $(event.currentTarget).html('本地图片');
            }
        },
        onMouseleaveButton: function(event) {
            $(event.currentTarget).removeClass('btn-success');
            $(event.currentTarget).addClass('btn-link');
            if (this.usingLocalImage == true) {
                $(event.currentTarget).html('本地图片');
            } else {
                $(event.currentTarget).html('图片链接');
            }
        },
        changeImageMode: function() {
            if (this.usingLocalImage == true) {
                $('#changeImageMode').html('图片链接');
                $('#imageURL').removeAttr('disabled');
                $('#imageURL').val('');
                $('.previewImage').attr('src', imageServer + '/background.png');
                this.usingLocalImage = false;
            } else {
                $('#changeImageMode').html('本地图片');
                $('#imageURL').attr('disabled', 'disabled');
                $('.previewImage').attr('src', imageServer + '/share-alt-image.png');
                this.usingLocalImage = true;
            }
        },
        uploadLocalImage: function() {
            if (this.usingLocalImage != true) return;
            if (this.uploadingImage == true) return;

            //trigger jquery-file-upload, no longer used.
//            $('#imageFile').click();

            //trigger UpaiYun upload
            $('#upaiUploadFile').click();
        },
        changeImageURL: function(event) {
            //Regular expression for test user input url of image
            //var reg = /^http:\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*)*\.(jpg|jpeg|png|gif)$/;
            var reg = /^http:\/\/[\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*(\.([\w\u0391-\uFFE5]+(-[\w\u0391-\uFFE5]+)*))*\//;

            var imageURL = $('#imageURL').val();
            var isValidURL = false;
            if (reg.test(imageURL)) {
                isValidURL = true;
            }
            if (isValidURL) {
                $('.previewImage').attr('src', imageURL);
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
                $('#previewSDes').html($('#shortDes').attr('placeholder'));
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
                $('#previewLDes').html($('#longDes').attr('placeholder'));
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
            this.usingLocalImage = true;
            this.uploadingImage = false;
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
        afterRender: function() {
            if (this.model.get('image') != undefined) {
                this.$('.previewImage').attr('src', this.model.get('image'));
            }
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