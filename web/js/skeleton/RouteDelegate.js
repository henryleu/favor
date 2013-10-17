define(['Underscore', './View'],
function(_, View) {
    var RouteDelegate = function(options){
        this.initialize(options);
    };

    RouteDelegate.defaults = {
        view: null,
        field: 'current',
        bubbleView: null, //if null, use view's parent view
        bubbleEvent: 'switch',
        navigateEvent: 'navigate'
    };

    _.extend(RouteDelegate.prototype, {
        initialize: function(options){
            _.extend(this, options||{});
            _.defaults(this, RouteDelegate.defaults);

            var view = this.view;
            if(!this.view) throw new Error('No model to bind for the RouteSwitcher');
            var field = this.field;
            view.model.on('change:' + field, this.onRoute, this);

            if(!this.bubbleView){
                this.bubbleView = view.getParent();
            }

            var rt = this.reactTrigger;
            if(typeof rt == 'string'){
                if(!view[rt]) throw new Error('There is no reactTrigger method named "'+rt+'" configured in the routing view');
                this.reactTrigger = function(){
                    view[rt].apply(view, arguments);
                };
            }
            else if (_.isFunction(rt)){

            }
            else{
                console.warn('There is no reactTrigger configured in the routing view');
            }
        },
        route: function(){
            this.view.model.set(this.field, arguments);
        },
        onRoute: function(model, route, options){
            var previousRoute = model.previous(this.field);
            var from = previousRoute==null ? [] : previousRoute;
            var to = route==null ? [] : route;


            //React the links or buttons when routing
            this.reactTrigger(from, to);

            //Trigger bubble view a navigating event (which make subview switched)
            this.bubbleView.trigger(this.navigateEvent, to);

            //Trigger bubble view a switching event (which make subview switched)
            this.bubbleView.model.trigger(this.bubbleEvent, from[0], to[0]);
        },
        reactTrigger: function(previousRoute, route){
            console.info('Routing from ' + previousRoute + ' to ' + route);
        }
    });

    return RouteDelegate;
});