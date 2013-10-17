define(['Underscore', 'Backbone', './Skeleton'], function(_, bb, Skeleton) {
    var mediator = Skeleton;
    var Model = bb.Model.extend({
        idAttribute: '_id', //backend use Mongodb, so use _id
        initialize: function(attributes, options){
            _.defaults(this, Model.defaults);
            this.children = {};
            this.on('sync', this.propagateSync, this);
            this.configure.apply(this, arguments);
        },
        configure: function(){},
        sync: function() {
            return Skeleton.sync.apply(this, arguments);
        },
        propagateSync: function(model, resp, options){
            var action = options.action;
            var modelClass = this.constructor;
            var modelClassName = modelClass.name;

            //Trigger model class level instance-events
            if(action){
                modelClass.trigger(action, model, resp, options);
            }
            modelClass.trigger('sync', model, resp, options);

            //Trigger mediator level model-class-events
            if(modelClassName){
                if(action){
                    mediator.trigger(modelClassName+':'+action, model, resp, options);
                }
                mediator.trigger(modelClassName+':'+'sync', model, resp, options);
            }

            //Trigger mediator level global-events
            if(action){
                mediator.trigger(action, model, resp, options);
            }
            mediator.trigger('sync', model, resp, options);
        },
        getParent: function(){return this.parent;},
        setParent: function(parent){this.parent = parent;return this;},
        getChild: function(name){return this.children[name];},
        getChildren: function(){return this.children;},
        addChild: function(name, child){
            this.children[name] = child;
            child.setParent(this);
            return this;
        }
    });

    Model.defaults = {
        parent: null
    };

    //Make Model's constructor have eventing ability
    var extend = function(){
        var result = null;
        result = bb.History.extend.apply(this, arguments);
        result = bb.History.extend.apply(result, [{}, bb.Events]);
        result.prototype.name = arguments[0].name;
        return result;
    };

    Model.extend = extend;

    return Model;
});