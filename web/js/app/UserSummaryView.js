define(['jQuery', 'skeleton'],
function($, sk) {
    var UserSummaryView = sk.View.extend({
        vid: 'user-summary',
        templateName: 'user-summary',
        configure: function(){
            this.listenTo(this.model, 'change:creates', this.changeCreates, this);
            this.listenTo(this.model, 'change:stars', this.changeStars, this);
        },
        changeCreates: function(model, value, options){
            var $el = this.$('.user .summary #creates span.text');
            $el.text(value);
        },
        changeStars: function(model, value, options){
            var $el = this.$('.user .summary #stars span.text');
            $el.text(value);
        }
    });

    return UserSummaryView;
});