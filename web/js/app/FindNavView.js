define(['jQuery', 'skeleton'],
function($, sk) {
    var FindNavView = sk.View.extend({
        vid: 'find-nav',
        templateName: 'find-nav',
        routes: {
            "things-:sort": "switchSort",
            "thing-:id": "viewThing"
        },
        events: {
            'click #navHandle': 'controlNav'
        },
        configure: function(){
            this.routeDelegate = new sk.RouteDelegate({
                view: this,
                reactTrigger: 'reactTrigger'
            });
        },
        reactTrigger: function(previous, current){
            this.$el.find('a[data-value='+previous[0]+']').removeClass('active');
            this.$el.find('a[data-value='+current[0]+']').addClass('active');
        },
        switchSort: function(sort){
            this.getParent().getParent().getChild('header').routeDelegate.route('find');
            this.getParent().show(); //TODO
            this.routeDelegate.route(sort);
        },
        viewThing: function(thingId){
            this.getParent().getParent().getChild('header').routeDelegate.route('find');
            this.getParent().show(); //TODO
            this.routeDelegate.route('showcase', thingId);
        },
        afterRender: function() {
            if('/find'==window.location.pathname){ //TODO: take care of hash (/#find)
                this.switchSort('auto');
            }
        },
        controlNav: function(e){
            this.$el.hide();
        }
    });

    return FindNavView;
});