define(['jQuery', 'jQueryCustom', 'skeleton'
    , './Navigator', './NavigatorView'
    , './Home', './HomeView'
    , './UserHolder', './MyView'],
function($, $custom, sk,
         Navigator, NavigatorView, Home, HomeView, UserHolder, MyView) {
    var MainView = sk.View.extend({
        templateName: 'main',
        routes: {
            "": "home"
            ,"home": "home"
            ,"my": "my"
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
            this.model.addChild('I', UserHolder.get());
            var myView = new MyView({
                model: UserHolder.get(),
                hidden: true,
                parent: this
            });
            this.addChild(myView);

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
        my: function(){
            this.model.set('module', 'my');
            this.routeDelegate.route('my');
            this.getChild('my').index();
        },
        afterRender: function(){
        }
    });

    return MainView;
});