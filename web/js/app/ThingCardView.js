define(['jQuery', 'skeleton', './UserHolder'], function($, sk, UserHolder) {
    var ThingCardView = sk.View.extend({
        templateName: 'waterfall-card',
        events: {
//            "click .lane .acton span#like": "onToggleLike",
//            "click .lane .acton span#star": "onToggleStar",
//            "click .lane .acton span#delete": "onDelete",
//            "click .lane .acton span#clone": "onClone"
        },
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'update', function(model, comings) {
                me.doRender();
            });
        },
        getTarget: function(el, selector){
            var $el = $(el);
            return $el.is(selector) ? $el : $el.parents(selector);
        }
    });

    return ThingCardView;
});