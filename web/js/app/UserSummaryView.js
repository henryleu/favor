define(['jQuery', 'skeleton'],
function($, sk) {
    var UserSummaryView = sk.View.extend({
        vid: 'user-summary',
        templateName: 'user-summary',
        configure: function(){
//            this.listenTo(this.model, 'change:module', this.changeModule, this);
        },
        changeModule: function(model, value, options){
        }
    });

    return UserSummaryView;
});