define(['jQuery', 'skeleton', './MainNavView', './UserSummaryView'],
function($, sk, MainNavView, UserSummaryView) {
    var NavigatorView = sk.View.extend({
        vid: 'navigator',
        templateName: 'navigator',
        routes: {
        },
        events: {
        },
        configure: function(){
            var mainNavView = new MainNavView({
                model: this.model.getParent()
            });
            this.addChild(mainNavView);

            var userSummaryView = new UserSummaryView({
                model: this.model.getParent().getChild('user')
            });
            this.addChild(userSummaryView);

        },
        afterRender: function() {
        }
    });

    return NavigatorView;
});