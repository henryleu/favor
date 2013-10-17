define(['jQuery', 'jQueryCustom', 'skeleton', './HeaderView', './HomeModel', './HomeView', './FindModel', './FindView', './ShareModel', './ShareView', './ForumModel', './ForumView', './AboutModel', './AboutView', './UserModel', './UserView'],
function($, $custom, sk, HeaderView, HomeModel, HomeView, FindModel, FindView, ShareModel, ShareView, ForumModel, ForumView, AboutModel, AboutView, UserModel, UserView) {
    var AppView = sk.View.extend({
        templateName: 'app',
        routes: {
            "": "home",
            "share": "share",
            "find": "find",
            "forum": "forum",
            "about": "about",
            "user": "user"
        },
        events: {
            "click .message": ""
        },
        configure: function(){
            this.routeDelegate = new sk.RouteDelegate({
                view: this,
                bubbleView: this,
                reactTrigger: 'reactTrigger'
            });
            this.viewSwitcher = new sk.ViewSwitcher({
                view: this,
                event: this.routeDelegate.bubbleEvent //by default, event is 'switch'
//                , hideAction: function(subView){
//                    console.debug('slideRightHide');
//                    $(subView.$el).slideUp();
//                }
//                , showAction: function(subView){
//                    console.debug('slideLeftShow');
//                    $(subView.$el).slideDown();
//                }
            });

            var headerView = new HeaderView({
                hidden: false,
                model: null
            });
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
            this.model.addChild('share', ShareModel);
            var shareView = new ShareView({
                hidden: true,
                parent: this,
                model: ShareModel
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
            this.bindMenus();
        },
        bindMenus: function(){
            var me = this;
            $('li>a[set]').click(function(e){
                var card = $(this).attr('set');
                if(!card){
                    console.warn('Without set attribute\' value, by default, cancel switching card');
                }
                else{
                    me.routeDelegate.route(card);
                }
            });
        },
        reactTrigger: function(previous, current){
            this.activateMenu(previous, false);
            this.activateMenu(current, true);
        },
        activateMenu: function(id, active){
            if(active){
                $('li>a[set='+id+']').parent().addClass('active');
            }
            else{
                $('li>a[set='+id+']').parent().removeClass('active');
            }
        },
        home: function(){
            this.routeDelegate.route('home');
        },
        find: function(){
            this.routeDelegate.route('find');
        },
        share: function(){
            this.routeDelegate.route('share');
        },
        forum: function(){
            this.routeDelegate.route('forum');
        },
        about: function(){
            this.routeDelegate.route('about');
        },
        user: function(){
            this.routeDelegate.route('user');
        }
    });

    return AppView;
});