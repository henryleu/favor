define(['jQuery', 'skeleton', './ThingDetailView'], function($, sk, ThingDetailView) {
    var ShowcaseView = sk.View.extend({
        vid: 'showcase',
        templateName: 'showcase',
        configure: function() {
        },
        removeThing: function(){
            var detailView = this.getChild('thing-detail');
            if(detailView){
                detailView.undelegateEvents();
                detailView.remove();
            }

            return this;
        },
        renderThing: function(){
            var thing = this.model.getCurrent();
            var fetched = thing.fetched;
            var thingDetailView = new ThingDetailView({
                model: thing,
                hidden: false,
                prerendered: false
            });
            this.addChild(thingDetailView);

            if(fetched){
                thingDetailView.doRender();
            }
            else{
                thing.fetch();
            }
            this.doRender();

            return this;
        },
        showThing: function(id){
            //Set current thing from collection or from scratch
            this.model.setCurrentId(id);
            if(this.current == this.model.getCurrent()){
                return this;
            }
            this.removeThing().renderThing();

            return this;
        }
    });

    return ShowcaseView;
});