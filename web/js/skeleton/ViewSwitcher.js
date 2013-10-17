define(['Underscore', 'Backbone', 'jQuery'],
function(_, bb, $) {
    var ViewSwitcher = function(options){
        _.extend(this, options||{});
        _.defaults(this, ViewSwitcher.defaults);
        if(!this.view){
            throw new Error('"view" parameter is required');
        }
        this.listenTo(this.view.model, this.event, this.switchSubView, this);
    };
    ViewSwitcher.defaults = {
        view: null,
        event: 'switch',
        showAction: 'show',
        hideAction: 'hide'
    };
    _.extend(ViewSwitcher.prototype, bb.Events, {
        switchSubView: function(previous, current){
            if(previous){
                this.hide(previous);
            }
            this.show(current);
        },
        show: function(card, options){
            //Get and check subView's existence
            var subView = this.view.getChild(card);
            if(!subView){
                console.error(card + ' is not found');
                return;
            }

            //Show card
            if(_.isFunction(this.showAction)){
                this.showAction(subView);
            }
            else{
                //TODO
                subView.show();
            }
            return this;
        },
        hide: function(card, options){
            //Get and check subView's existence
            var subView = this.view.getChild(card);
            if(!subView){
                console.error(card + ' is not found');
                return;
            }

            //Hide card
            if(_.isFunction(this.hideAction)){
                this.hideAction(subView);
            }
            else{
                //TODO
                subView.hide();
            }
            return this;
        }
    });

    return ViewSwitcher;
});