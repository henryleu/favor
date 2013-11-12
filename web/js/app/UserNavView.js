define(['jQuery', 'skeleton'],
function($, sk) {
    var UserNavView = sk.View.extend({
        vid: 'user-nav',
        templateName: 'user-nav',
        configure: function(){
//            this.listenTo(this.model, 'change:creates', this.changeCreates, this);
//            this.listenTo(this.model, 'change:stars', this.changeStars, this);
        },
        changeCreates: function(model, value, options){
            var $el = this.$('.user .nav #creates span.text');
            $el.text(value);
        },
        changeStars: function(model, value, options){
            var $el = this.$('.user .nav #stars span.text');
            $el.text(value);
        }
    });

    return UserNavView;
});