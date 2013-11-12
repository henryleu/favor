define(['jQuery', 'skeleton', './ThingsCreated', './ThingsCreatedView', './CollectionState', './CollectionFlowView'],
function($, sk, ThingsCreated, ThingsCreatedView, CollectionState, CollectionFlowView) {
    var UserCreatesView = sk.View.extend({
        vid: 'user-creates',
        templateName: 'user-creates',
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
        index: function(){
            if(!this.isFetched()){
                var things = this.model.getChild('things');
                var params = {sort:'auto'};
                things.fetch(params);
                this.lastCollect = params.sort;
            }
            else{
            }
        },
        collect: function(params){
            var sort = params.sort;
            var things = this.model.getChild('things');
            if(this.lastCollect!=sort){
                things.fetch({sort: sort});
                this.lastCollect = sort;
            }
            else{
                sort = 'auto';
                if(!things.fetched){
                    things.fetch({sort: sort});
                    this.lastCollect = sort;
                }
            }
        },
        refresh: function(){
            var params = {};
            var things = this.model.getChild('things');
            if(!this.lastCollect){
                this.lastCollect = 'auto';
            }
            params.sort = this.lastCollect;
            things.fetch(params);
        }
    });

    return UserCreatesView;
});