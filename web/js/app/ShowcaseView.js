define(['jQuery', 'skeleton'], function($, sk) {
    //TODO:
    var ShowcaseView = sk.View.extend({
        templateName: 'showcase',
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                me.model.fetched = true;
                me.doRender();
            });
        }
    });

    return ShowcaseView;
});