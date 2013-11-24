define(['jQuery', 'skeleton'
    , './Collection', './CollectionView'
    , './Showcase', './ShowcaseView'],
function($, sk, Collection, CollectionView, Showcase, ShowcaseView) {
    var HomeView = sk.View.extend({
        vid: 'home',
        templateName: 'home',
        routes: {
            "things-index": "collectIndex"
            , "things-collect-(:tags)-(:stream)-(:pageStart)": "collect"
//            , "things-:sort": "collect"
            , "thing-:id": "detail"
        },
        configure: function(){
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
            var collectionView = new CollectionView({
                model: collection,
                hidden: true,
                parent: this
            });
            this.addChild(collectionView);

            //Configure showcase
            var showcase = new Showcase();
            showcase.fetched = true;
            showcase.setCollection(collection);
            this.model.addChild('showcase', showcase);
            var showcaseView = new ShowcaseView({
                model: showcase,
                hidden: true,
                parent: this
            });

            this.addChild(showcaseView);

            this.routeDelegate = new sk.RouteDelegate({
                view: this,
                bubbleView: this
            });
        },
        index: function(){
            var current = this.model.get('current');
            if(!current){
                this.routeDelegate.route('collection');
                this.getChild('collection').index();
            }
        },
        collectIndex: function(){
            var startTime = new Date().getTime();
            this.getParent().home();
            this.routeDelegate.route('collection');
            var endTime = new Date().getTime();
            this.getChild('collection').index();
            console.log('took ' + (endTime-startTime));
        },
        collect: function(tags, stream, pageStart){
console.log('tags: ' + tags + '| stream: ' + stream + ' | pageStart: ' + pageStart);
            this.getParent().home();
            this.routeDelegate.route('collection');
            this.getChild('collection').collect(tags, stream, pageStart);
        },
        detail: function(id){
            this.getParent().home();
            this.routeDelegate.route('showcase');
            this.getChild('showcase').showThing(id);
        }
    });

    return HomeView;
});