define(['jQuery', 'skeleton', './ThingsAuto', './ThingsNew', './ThingsHot', './WaterfallView', './ShowcaseView'],
function($, sk, ThingsAuto, ThingsNew, ThingsHot, WaterfallView, ShowcaseView) {
    //TODO:
    var FindView = sk.View.extend({
        vid: 'find',
        templateName: 'find',
        events: {
            'click .waterfall': 'useWaterfallView',
            'click .showcase':  'useShowcaseView'
        },
        useWaterfallView: function() {
            var newViewType =  'waterfall';
            if(this.currentViewType!=newViewType){
                this.hidePreviousView();
                this.currentViewType = newViewType;
                this.refreshCurrentView();
            }
        },
        useShowcaseView: function() {
            var newViewType =  'showcase';
            if(this.currentViewType!=newViewType){
                this.hidePreviousView();
                this.currentViewType = newViewType;
                this.refreshCurrentView();
            }
        },
        getModelType: function(name){
            if(!this.modelTypeMap){
                this.modelTypeMap = {auto: ThingsAuto, 'new': ThingsNew, hot: ThingsHot};
            }
            return this.modelTypeMap[name];
        },
        getViewType: function(name){
            if(!this.viewTypeMap){
                this.viewTypeMap = {waterfall: WaterfallView, showcase: ShowcaseView};
            }
            return this.viewTypeMap[name];
        },
        switchCollection: function(collection){
            this.hidePreviousView();
            this.currentModelType = collection;
            this.refreshCurrentView();
        },
        hidePreviousView: function(){
            var previousView = this.getChild(this.getSubViewId(this.currentModelType, this.currentViewType));
            previousView.hide();
        },
        refreshCurrentView: function(){
            var viewType = this.currentViewType;
            var modelType = this.currentModelType;

            var model = this.model.getChild(modelType);
            var view = this.getChild(this.getSubViewId(modelType, viewType));
            if(model.fetched){
                view.render();
            }
            else{
                model.fetch();
            }
            view.show();
        },
        getSubViewId: function(modelName, viewName){
            return 'things-' + modelName + '-in-' + viewName;
        },
        getSubView: function(modelName, viewName){
            return this.getChild(this.getSubViewId(modelName, viewName));
        },
        configureSubView: function(modelName, viewName){
            var ModelType = this.getModelType(modelName);
            var model = new ModelType();
            this.model.addChild(modelName, model);

            var ViewType = this.getViewType(viewName);
            var vid = this.getSubViewId(modelName, viewName);
            var view = new ViewType({
                vid: vid,
                model: model,
                prerendered: false
            });
            this.addChild(view);
            view.listenTo(model, 'sync', function(model, resp, options){
                view.doRender();
            });
        },
        configure: function() {
            this.viewSwitcher = new sk.ViewSwitcher({
                view: this
//                , hideAction: function(subView){
//                    console.debug('slideRightHide');
//                    $(subView.$el).slideUp();
//                }
//                , showAction: function(subView){
//                    console.debug('slideLeftShow');
//                    $(subView.$el).slideDown();
//                }
            });
            this.currentModelType = 'auto';
            this.currentViewType = 'waterfall';

            this.configureSubView('auto','waterfall');
            this.configureSubView('auto','showcase');
            this.configureSubView('new','waterfall');
            this.configureSubView('new','showcase');
            this.configureSubView('hot','waterfall');
            this.configureSubView('hot','showcase');
        },
        afterRender: function() {
        },
        afterRenderChildren: function() {
        }
    });

    return FindView;
});