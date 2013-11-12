define(['jQuery', 'skeleton', './MainNavView', './UserSummaryView', './UserNavView'],
function($, sk, MainNavView, UserSummaryView, UserNavView) {
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

            var userNavView = new UserNavView({
                model: this.model.getParent()
            });
            this.addChild(userNavView);
        },
        afterRender: function() {
        }
    });

    return NavigatorView;
});