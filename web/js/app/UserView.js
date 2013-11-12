define(['jQuery', 'skeleton', './ShareModel', './ShareView', './Collection', './UserCreatesView'],
function($, sk, ShareModel, ShareView, Collection, UserCreatesView) {
    var UserView = sk.View.extend({
        vid: 'user',
        templateName: 'user',
        routes: {
            "user-profile": "profile"
            , "user-creates": "creates"
            , "user-stars": "stars"
        },
        configure: function(){
            //Configure share
//            var shareModel = new ShareModel();
//            this.model.addChild('share', shareModel);
//            var shareView = new ShareView({
//                hidden: false,
//                parent: this,
//                model: shareModel
//            });
//            this.addChild(shareView);

            var me = this;
            this.viewSwitcher = new sk.ViewSwitcher({
                view: this,
                switchSubView: function(previous, current){
                    var prevCard = me.getChild(previous);
                    if(prevCard){
                        prevCard.hide();
                    }
                    var curCard = me.getChild(current);
                    if(curCard){
                        curCard.show();
                    }
                }
            });

            //Configure collection
            var collection = new Collection();
            collection.fetched = true;
            this.model.addChild('collection', collection);
            var userCreatesView = new UserCreatesView({
                model: collection,
                hidden: true,
                parent: this
            });
            this.addChild(userCreatesView);

            this.routeDelegate = new sk.RouteDelegate({
                view: this,
                bubbleView: this,
                reactTrigger: 'reactTrigger'
            });
        },
        reactTrigger: function(previous, current){
            this.activateMenu(previous[0], false);
            this.activateMenu(current[0], true);
        },
        activateMenu: function(id, active){
            if(active){
                $('.user .menu li>a[set='+id+']').parent().addClass('active');
            }
            else{
                $('.user .menu  li>a[set='+id+']').parent().removeClass('active');
            }
        },
        index: function(){
            var current = this.model.get('current');
            if(!current){
                this.routeDelegate.route('user-creates');
                this.getChild('user-creates').index();
            }
        },
        profile: function(sort){
            this.getParent().user();
            this.routeDelegate.route('user-profile');
        },
        creates: function(sort){
            this.getParent().user();
            this.routeDelegate.route('user-creates');
            this.getChild('user-creates').index();
        },
        stars: function(id){
            this.getParent().user();
            this.routeDelegate.route('user-stars');
//            this.getChild('showcase').showThing(id);
        }
    });

    return UserView;
});