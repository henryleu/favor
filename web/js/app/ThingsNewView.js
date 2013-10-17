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
        }
    });

    return ThingsNewView;
});