define(['jQuery', 'skeleton', './ShareModel', './ShareView', './Collection', './MyPostsView'],
function($, sk, ShareModel, ShareView, Collection, MyCreatesView) {
    var UserView = sk.View.extend({
        vid: 'my',
        templateName: 'my',
        routes: {
            "my-profile": "profile"
            , "my-posts": "posts"
            , "my-stars": "stars"
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
            var myCreatesView = new MyCreatesView({
                model: collection,
                hidden: true,
                parent: this
            });
            this.addChild(myCreatesView);

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
                this.routeDelegate.route('my-posts');
                this.getChild('my-posts').index();
            }
        },
        profile: function(sort){
            this.getParent().my();
            this.routeDelegate.route('my-profile');
        },
        posts: function(sort){
            this.getParent().my();
            this.routeDelegate.route('my-posts');
            this.getChild('my-posts').index();
        },
        stars: function(id){
            this.getParent().my();
            this.routeDelegate.route('my-stars');
//            this.getChild('showcase').showThing(id);
        }
    });

    return UserView;
});