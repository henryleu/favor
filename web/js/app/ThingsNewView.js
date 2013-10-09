define(['jQuery', 'skeleton', './WaterfallView'],
function($, sk, WaterfallView) {
    var ThingsNewView = sk.View.extend({
        vid: 'things-new',
        templateName: 'things-new',
        configure: function(){
            var waterfallView = new WaterfallView({
                vid: 'new-waterfall',
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

    return ThingsNewView;
});