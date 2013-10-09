define(['jQuery', 'skeleton'],
function($, sk) {
    var FindNavView = sk.View.extend({
        vid: 'find-nav',
        templateName: 'find-nav',
        routes: {
            "things-:sort": "switchSort"
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
            this.$el.find('a[data-value='+previous+']').removeClass('active');
            this.$el.find('a[data-value='+current+']').addClass('active');
        },
        switchSort: function(sort){
            this.getParent().getParent().getChild('header').routeDelegate.route('find');
            this.getParent().show();
            this.routeDelegate.route(sort);
        },
        afterRender: function() {
            if('/find'==window.location.pathname){
                this.switchSort('auto');
            }
        },
        controlNav: function(e){
            this.$el.hide();
        }
    });

    return FindNavView;
});