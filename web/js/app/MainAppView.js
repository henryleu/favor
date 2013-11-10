define(['jQuery', 'jQueryCustom', 'skeleton'
    , './Navigator', './NavigatorView'
    , './Home', './HomeView'
    , './User', './UserView'],
function($, $custom, sk, Navigator, NavigatorView, Home, HomeView, User, UserView) {
    var MainView = sk.View.extend({
        templateName: 'main',
        routes: {
            "": "home"
            ,"home": "home"
            ,"user": "user"
        },
        ensureUser: function() {
            window.user = window.user || {};
            window.user.meta = window.user.meta || {creates:{},stars:{},likes:{}};
        },
        configure: function(){
            this.ensureUser();
            this.viewSwitcher = new sk.ViewSwitcher({view: this});

            //Configure user main view
            Home.fetched = true;
            this.model.addChild('home', Home);
            var homeView = new HomeView({
                model: Home,
                hidden: true,
                parent: this
            });
            this.addChild(homeView);

            //Configure user main view
            var user = new User();
            user.init(window.user);
            user.fetched = true;
            this.model.addChild('user', user);
            var userView = new UserView({
                model: user,
                hidden: true,
                parent: this
            });
            this.addChild(userView);

            //Configure navigator
            var navigator = new Navigator();
            navigator.fetched = true;
            this.model.addChild('navigator', navigator);
            var navigatorView = new NavigatorView({
                model: navigator,
                parent: this
            });
            this.addChild(navigatorView);

            this.routeDelegate = new sk.RouteDelegate({
                view: this,
                bubbleView: this
            });
        },
        getSubViewId: function(name){
            return name;
        },
        home: function(){
            this.model.set('module', 'home');
            this.routeDelegate.route('home');
            if(window.location.pathname == '/home'){
                this.getChild('home').index();
            }
        },
        user: function(){
            this.model.set('module', 'user');
            this.routeDelegate.route('user');
//            this.getChild('user').index();
        },
        afterRender: function(){
        }
    });

    return MainView;
});