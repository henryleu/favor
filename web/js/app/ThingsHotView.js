define(['jQuery', 'skeleton', './WaterfallView'],
function($, sk, WaterfallView) {
    var ThingsHotView = sk.View.extend({
        vid: 'things-hot',
        templateName: 'things-hot',
        configure: function(){
            var waterfallView = new WaterfallView({
                vid: 'hot-waterfall',
                model: this.model
            });
            this.addChild(waterfallView);
            var me = this;
            this.listenTo(this.model, 'sync', function(model, resp, options){
                model.fetched = true;
                me.doRender();
            });
        }
    });

    return ThingsHotView;
});