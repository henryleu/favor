define(['jQuery', 'skeleton'],
function($, sk) {
    var MyNavView = sk.View.extend({
        vid: 'my-nav',
        templateName: 'my-nav',
        configure: function(){
//            this.listenTo(this.model, 'change:creates', this.changeCreates, this);
//            this.listenTo(this.model, 'change:stars', this.changeStars, this);
        },
        changeCreates: function(model, value, options){
            var $el = this.$('.my .nav #creates span.text');
            $el.text(value);
        },
        changeStars: function(model, value, options){
            var $el = this.$('.my .nav #stars span.text');
            $el.text(value);
        }
    });

    return MyNavView;
});