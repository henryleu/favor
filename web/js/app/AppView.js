define(['jQuery', 'jQueryCustom', 'skeleton', './HeaderModel', './HeaderView', './HomeModel', './HomeView', './FindModel', './FindView', './ShareModel', './ShareView', './ForumModel', './ForumView', './AboutModel', './AboutView', './UserModel', './UserView'],
function($, $custom, sk, HeaderModel, HeaderView, HomeModel, HomeView, FindModel, FindView, ShareModel, ShareView, ForumModel, ForumView, AboutModel, AboutView, UserModel, UserView) {
    var AppView = sk.View.extend({
        templateName: 'app',
        configure: function(){
            this.viewSwitcher = new sk.ViewSwitcher({
                view: this
//                , hideAction: function(subView){
//                    console.debug('slideRightHide');
//                    $(subView.$el).slideUp();
//                }
//                , showAction: function(subView){
//                    console.debug('slideLeftShow');
//                    $(subView.$el).slideDown();
//                }
            });

            this.model.addChild('header', HomeModel);
            var headerView = new HeaderView({
                model: HeaderModel,
                parent: this
            });
            this.addChild(headerView);
            headerView.setElement($('.main-header'));

            //Configure home
            this.model.addChild('home', HomeModel);
            var homeView = new HomeView({
                hidden: true,
                parent: this,
                model: HomeModel
            });
            this.addChild(homeView);

            //Configure find
            this.model.addChild('find', FindModel);
            var findView = new FindView({
                hidden: true,
                parent: this,
                model: FindModel
            });
            this.addChild(findView);

            //Configure share
            var shareModel = new ShareModel();
            this.model.addChild('share', shareModel);
            var shareView = new ShareView({
                hidden: true,
                parent: this,
                model: shareModel
            });
            this.addChild(shareView);

            //Configure forum
            this.model.addChild('forum', ForumModel);
            var forumView = new ForumView({
                hidden: true,
                parent: this,
                model: ForumModel
            });
            this.addChild(forumView);

            //Configure about
            this.model.addChild('about', HomeModel);
            var aboutView = new AboutView({
                hidden: true,
                parent: this,
                model: AboutModel
            });
            this.addChild(aboutView);

            //Configure user
            this.model.addChild('user', UserModel);
            var userView = new UserView({
                hidden: true,
                parent: this,
                model: UserModel
            });
            this.addChild(userView);
        },
        afterRender: function(){
        }
    });

    return AppView;
});