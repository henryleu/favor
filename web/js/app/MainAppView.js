define(['jQuery', 'jQueryCustom', 'skeleton'
    , './UserHolder'
    , './Navigator', './NavigatorView'
    , './Home', './HomeView'
    , './User', './UserView'],
function($, $custom, sk,
         UserHolder,
         Navigator, NavigatorView, Home, HomeView, User, UserView) {
    var MainView = sk.View.extend({
        templateName: 'main',
        routes: {
            "": "home"
            ,"home": "home"
            ,"user": "user"
        },
        configure: function(){
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
            this.model.addChild('user', UserHolder.get());
            var userView = new UserView({
                model: UserHolder.get(),
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