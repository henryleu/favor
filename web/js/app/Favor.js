define(['jQuery', 'skeleton', './MainApp', './MainAppView'],
function($, sk, MainApp, MainAppView) {
    var Favor = sk.Spa.extend({
        configure: function(){
            this.model = MainApp;
            this.view = new MainAppView({
                model: MainApp
            });
            $('body section > div > div[data-view-id=main]').replaceWith(this.view.el);
        }
    });

    return Favor;
});