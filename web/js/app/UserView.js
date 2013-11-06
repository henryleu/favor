define(['jQuery', 'skeleton', './ShareModel', './ShareView'],
function($, sk, ShareModel, ShareView) {
    var UserView = sk.View.extend({
        vid: 'user',
        templateName: 'user',
        configure: function(){
            //Configure share
            var shareModel = new ShareModel();
            this.model.addChild('share', shareModel);
            var shareView = new ShareView({
                hidden: false,
                parent: this,
                model: shareModel
            });
            this.addChild(shareView);
        }
    });

    return UserView;
});