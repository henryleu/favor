define(['jQuery', 'skeleton', './ThingsCollection', './WaterfallView', './CollectionState', './CollectionFlowView'],
function($, sk, ThingsCollection, WaterfallView, CollectionState, CollectionFlowView) {
    var CollectionView = sk.View.extend({
        vid: 'collection',
        templateName: 'collection',
        lastCollect: null,
        configure: function(){
            var things = new ThingsCollection();
            this.model.addChild('things', things);
            var waterfallView = new WaterfallView({
                vid: 'waterfall',
                model: things
            });
            this.addChild(waterfallView);

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
console.log('things is to fetch');
            }
            else{
console.log('things has been fetched');
            }
        },
        collect: function(params){
            var sort = params.sort;
            var things = this.model.getChild('things');
            if(this.lastCollect!=sort){
                things.fetch({sort: sort});
                this.lastCollect = sort;
console.log('things is to fetch');
            }
            else{
                sort = 'auto';
                if(!things.fetched){
                    things.fetch({sort: sort});
                    this.lastCollect = sort;
                }
console.log('things has been fetched');
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

    return CollectionView;
});