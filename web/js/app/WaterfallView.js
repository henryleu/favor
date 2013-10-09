define(['jQuery', 'skeleton'], function($, sk) {
    //TODO:
    var WaterfallView = sk.View.extend({
        templateName: 'waterfall',
        events: {
            'click .thing': 'onClickItem'
        },
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                if(options.action=='read'){
                    me.model.fetched = true;
                    me.doRender();
                }
            });
        },
        onClickItem: function(event) {
            this.dealView.viewDeal($(event.currentTarget).attr('dealId'));
        }
    });

    return WaterfallView;
});