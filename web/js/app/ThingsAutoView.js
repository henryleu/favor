define(['jQuery', 'skeleton', './WaterfallView'],
function($, sk, WaterfallView) {
    var ThingsAutoView = sk.View.extend({
        vid: 'things-auto',
        templateName: 'things-auto',
        configure: function(){
//            this.model.addChild('waterfall', this.model);
            var waterfallView = new WaterfallView({
                vid: 'auto-waterfall',
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

    return ThingsAutoView;
});