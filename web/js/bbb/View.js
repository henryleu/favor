define(['Underscore', 'Backbone', 'jQuery'], function(_, bb, $) {
    var viewOptions = ['spa', 'hidden', 'modelDriven', 'prerendered', 'templateName', 'vid' ];
    var View = bb.View.extend({
        //spa: null, //spa: the central application object
        //children: null, //child registry
        //parent: null,
        //hidden: false,
        //modelDriven: true,
        //prerendered: false,
        //rendered: false,
        //templateName: null, //template name
        //template: null,  //template compiled function
        //vid: '',
        defaults: function (){
            return {
                spa: null,
                children: {},
                parent: null,
                hidden: false,
                modelDriven: true,
                prerendered: true,
                rendered: false,
                templateName: '',
                template: null,
                vid: ''
            }
        },
        initialize: function(options){
            _apply(this, this.defaults());
            _apply(this, _.pick(options, viewOptions));
            this.configure.apply(this, arguments);
            if(this.prerendered){
                this.doRender();
            }
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
        render: function(){
            if(!this.rendered){
                this.doRender();
            }
            return this;
        },
        doRender: function(){
            this.ensureTemplate();
            var model = _.result(this, 'model');
//alert(this.modelDriven + ' ' + this.fetched);
//            if(this.modelDriven && !model.fetched){
//                return this;
//            }
            var json = {};
            if(model.toJSON){
                json = model.toJSON();
            }
            this.$el.html(this.template( {input: json, id: this.getId()} )); //TODO: try to use $el

            this.afterRender();
            this.rendered = true;

            if(this.hidden) this.hide();
            else this.show();

            this.renderChildren();
            this.afterRenderChildren();
            return this;
        },
        ensureTemplate: function(){
            if(!this.template){
                this.template = this.spa.tm.get(this.templateName);
            }
        },
        renderChildren: function(){
            _.each(this.children, function(view, id) {
                this.$('[data-view-id="' + id + '"]').replaceWith(view.el);
            }, this);
        },
        afterRender: function(){},
        afterRenderChildren: function(){},
        show: function(){this.$el.show();this.hidden = false;return this;},
        hide: function(){this.$el.hide();this.hidden = true;return this;},
        isRendered: function(){return this.rendered;},
        isHidden: function(){return this.hidden;}
    });
    return View;
});