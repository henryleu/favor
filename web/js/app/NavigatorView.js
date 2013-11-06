define(['jQuery', 'skeleton', './MainNavView'],
function($, sk, MainNavView) {
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
        },
        afterRender: function() {
        }
    });

    return NavigatorView;
});