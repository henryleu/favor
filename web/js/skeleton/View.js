define(['Underscore', 'Backbone', 'jQuery', './Router'],
function(_, bb, $, Router) {
    var View = bb.View.extend({
        initialize: function(options){
            _.extend(this, options);
            _.defaults(this, View.defaults);
            this._bindRoutes();
            this.configure.apply(this, arguments);
            if(this.prerendered){
                this.doRender();
            }
        },
        getRouter: function(){
            if(!this.router){
                this.router = new Router({});
            }
            return this.router;
        },
        _bindRoutes: function(){
            if (!this.routes) return;
            this.routes = _.result(this, 'routes');
            var route, routes = _.keys(this.routes);
            while ((route = routes.pop()) != null) {
                this.route(route, this.routes[route]);
            }
        },
        route: function(route, name, callback){
            if(!callback){
                var view = this;
                callback = function(){
                    if(!view[name] || !_.isFunction(view[name])){
                        console.error('In view ' + view.vid + ', there is no method ' + name);
                    }
                    view[name].apply(view, arguments);
                };
            }
            this.getRouter().route(route, name, callback);
        },
        configure: function(){},
        getId: function(){return this.vid;},
        getParent: function(){return this.parent;},
        setParent: function(parent){this.parent = parent;return this;},
        getChild: function(childId){return this.children[childId];},
        getChildren: function(){return this.children;},
        addChild: function(child){
            this.children[child.getId()] = child;
            child.setParent(this);
            return this;
        },
        removeChild: function(childId){
            if(this.children[childId]){
                this.children[childId].setParent(null);
                this.children[childId] = null;
                delete this.children[childId];
            }
            return this;
        },
        render: function(force){
            if(force){
                if(this.model.fetched){
                    if(!this.rendered){
                        this.doRender();
                    }
                }
                else{
                    var v = this;
                    this.model.fetch({
                        success: function(model, resp, options){
                            v.doRender();
                        }
                    });
                }
            }
            else{
                if(!this.rendered){
                    this.doRender();
                }
            }
            return this;
        },
        doRender: function(){
            var input = {};
            if(this.model){
                var model = _.result(this, 'model');
                if(model.toJSON){
                    input = model.toJSON();
                }
            }
            this.$el.html(this.evaluateTemplate( {input: input, id: this.getId()} ))
            this.afterRender();
            this.rendered = true;

            if(this.hidden) this.hide();
            else this.show();

            this.renderChildren();
            this.afterRenderChildren();
            return this;
        },
        evaluateTemplate: function(data){
            if(!this.template){
                if(!View.templates[this.templateName]){
                    var msg = 'Javascript template \"'+ this.templateName + '\" does not exist';
                    console.error(msg);
                    return function(){alert(msg);};
                }
                else{
                    this.template = View.templates[this.templateName];
                }
            }
            return this.template(data);
        },
        renderChild: function(view){
            var id = view.getId();
            view.$el.attr('data-view-id', id);
            this.$('[data-view-id="' + id + '"]').replaceWith(view.el);
            return this;
        },
        renderChildren: function(){
            _.each(this.children, this.renderChild, this);
            return this;
        },
        afterRender: function(){},
        afterRenderChildren: function(){},
        show: function(){this.$el.show();this.hidden = false;return this;},
        hide: function(){this.$el.hide();this.hidden = true;return this;},
        isRendered: function(){return this.rendered;},
        isHidden: function(){return this.hidden;}
    });
    View.defaults = {
        routes: {},
        children: {},
        parent: null,
        hidden: false,
        prerendered: true,
        rendered: false,
        templateName: '',
        template: null,
        vid: ''
    };
    View.templates = {};

    var extend = function(){
        var result = bb.History.extend.apply(this, arguments);

        /*
         * Collect all new defined view's template name
         */
        var protoProps = arguments[0];
        if(protoProps && protoProps.templateName){
            View.templates[protoProps.templateName] = null;
        }
        return result;
    };

    View.extend = extend;

    return View;
});