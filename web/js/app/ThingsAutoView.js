define(['jQuery', 'skeleton', './WaterfallView'],
function($, sk, WaterfallView) {
    var ThingsAutoView = sk.View.extend({
        vid: 'things-auto',
        templateName: 'things-auto',
        configure: function(){
            var waterfallView = new WaterfallView({
                vid: 'auto-waterfall',
                model: this.model
            });
            this.addChild(waterfallView);
        }
    });

    return ThingsAutoView;
});