define(['jQuery', 'skeleton', './ThingsCollected', './WaterfallView', './CollectionFlowView'],
function($, sk, ThingsCollected, WaterfallView, CollectionFlowView) {
    var CollectionView = sk.View.extend({
        vid: 'collection',
        templateName: 'collection',
        lastCollect: null,
        configure: function(){
            var things = new ThingsCollected();
            this.model.addChild('things', things);
            var waterfallView = new WaterfallView({
                vid: 'waterfall',
                model: things
            });
            this.addChild(waterfallView);

            var flowView = new CollectionFlowView({
                model: things,
                col: things
            });
            this.addChild(flowView);
        },
        isFulled: function(){
            return this.model.getChild('things').pulled;
        },
        index: function(){
            if(!this.isFulled()){
                var things = this.model.getChild('things');
                var params = {sort:'auto'};
                var tags = ''; //TODO: get default
                var stream = ''; //TODO: get default
                things.find(tags, stream, 0);
            }
        },
        collect: function(tags, stream, pageStart){
            var things = this.model.getChild('things');
            if(!pageStart) pageStart = 0;
            things.find(tags, stream, pageStart);
        },
        refresh: function(){
            var things = this.model.getChild('things');
            things.refresh();
        }
    });

    return CollectionView;
});