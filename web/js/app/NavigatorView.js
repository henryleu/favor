define(['jQuery', 'skeleton', './MainNavView', './MySummaryView', './MyNavView'],
function($, sk, MainNavView, MySummaryView, MyNavView) {
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

            var mySummaryView = new MySummaryView({
                model: this.model.getParent().getChild('I')
            });
            this.addChild(mySummaryView);

            var myNavView = new MyNavView({
                model: this.model.getParent().getChild('I')
            });
            this.addChild(myNavView);
        },
        afterRender: function() {
        }
    });

    return NavigatorView;
});