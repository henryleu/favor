define(['jQuery', 'skeleton', './AppModel', './AppView'],
function($, sk, AppModel, AppView) {
    var Favor = sk.Spa.extend({
        configure: function(){
            this.model = AppModel;
            this.view = new AppView({
                model: AppModel
            });
            $('.main-body').replaceWith(this.view.el);
        }
    });

    return Favor;
});