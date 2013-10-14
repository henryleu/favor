define(['jQuery', 'skeleton', './ThingDetailView'], function($, sk, ThingDetailView) {
    var ShowcaseView = sk.View.extend({
        vid: 'showcase',
        templateName: 'showcase',
        configure: function() {
            this.listenTo(this.parent, 'navigate', this.setThing, this);
        },
        render: function(force){
            if(!this.rendered){
                this.doRender();
            }
            if(this.current == this.model.getCurrent()){
                return this;
            }
            this.removeThing().renderThing();
            return this;
        },
        setThing: function(params){
            var route = params[0];
            var thingId = params[1];
            if(route=='showcase'){
                this.model.setCurrentId(thingId);
            }
            else{
                var col = this.model.getParent().getChild(route);
                this.model.setCollection(col);
            }
        },
        removeThing: function(){
//            console.info('remove thing detail view');
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
                this.doRender();
            }
            else{
                thing.fetch();
                this.doRender();
            }
            return this;
        }
    });

    return ShowcaseView;
});