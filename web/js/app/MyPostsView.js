define(['jQuery', 'skeleton', './ThingsCreated', './ThingsCreatedView', './CollectionState', './CollectionFlowView'],
function($, sk, ThingsCreated, ThingsCreatedView, CollectionState, CollectionFlowView) {
    var MyPostsView = sk.View.extend({
        vid: 'my-posts',
        templateName: 'my-posts',
        configure: function(){
            var things = new ThingsCreated();
            this.model.addChild('things', things);
            var thingsCreatedView = new ThingsCreatedView({
                model: things
            });
            this.addChild(thingsCreatedView);

            var state = new CollectionState();
            this.model.addChild('state', state);
            var flowView = new CollectionFlowView({
                model: state
            });
            this.addChild(flowView);
        },
        isFetched: function(){
            return this.model.getChild('things').fetched;
        },
        isPulled: function(){
            return this.model.getChild('things').pulled;
        },
        index: function(){
            if(!this.isPulled()){
                var things = this.model.getChild('things');
//                var params = {sort:'auto'};
//                things.fetch(params);
                things.pull();
            }
        },
//        collect: function(params){
//            var sort = params.sort;
//            var things = this.model.getChild('things');
//            if(this.lastCollect!=sort){
//                things.fetch({sort: sort});
//                things.pull();
//            }
//            else{
//                sort = 'auto';
//                if(!things.fetched){
//                    things.fetch({sort: sort});
//                }
//            }
//        },
        refresh: function(){
            var params = {};
            var things = this.model.getChild('things');
//            if(!this.lastCollect){
//                this.lastCollect = 'auto';
//            }
//            params.sort = this.lastCollect;
//            things.fetch(params);
            things.pull();
        }
    });

    return MyPostsView;
});