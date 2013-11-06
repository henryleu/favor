define(['jQuery', 'skeleton'],
function($, sk) {
    var MainNavView = sk.View.extend({
        vid: 'main-nav',
        templateName: 'main-nav',
        configure: function(){
            this.listenTo(this.model, 'change:module', this.changeModule, this);
        },
        changeModule: function(model, value, options){
            var previous = model.previous('module');
            this.$('a#'+previous).removeClass('active');
            this.$('a#'+value).addClass('active');
        }
    });

    return MainNavView;
});