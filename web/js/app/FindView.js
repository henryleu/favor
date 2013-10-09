define(['jQuery', 'skeleton', './FindNavModel', './FindNavView', './FlowCtrlModel', './FlowCtrlView', './ThingsAuto', './ThingsAutoView', './ThingsNew', './ThingsNewView', './ThingsHot', './ThingsHotView'],
function($, sk, FindNavModel, FindNavView, FlowCtrlModel, FlowCtrlView, ThingsAuto, ThingsAutoView, ThingsNew, ThingsNewView, ThingsHot, ThingsHotView) {
    var FindView = sk.View.extend({
        vid: 'find',
        templateName: 'find',
        getSubViewId: function(modelName){
            return 'things-' + modelName;
        },
        configure: function() {
            this.model.addChild('auto', FlowCtrlModel);
            var flowCtrlView = new FlowCtrlView({
                model: FlowCtrlModel,
                hidden: false,
                prerendered: true
            });
            this.addChild(flowCtrlView);

            var subModel, subView;
            subModel = new ThingsAuto();
            this.model.addChild('auto', subModel);
            subView = new ThingsAutoView({
                model: subModel,
                hidden: true,
                prerendered: true
            });
            this.addChild(subView);

            subModel = new ThingsNew();
            this.model.addChild('new', subModel);
            subView = new ThingsNewView({
                model: subModel,
                hidden: true,
                prerendered: true
            });
            this.addChild(subView);

            subModel = new ThingsHot();
            this.model.addChild('hot', subModel);
            subView = new ThingsHotView({
                model: subModel,
                hidden: true,
                prerendered: true
            });
            this.addChild(subView);

            var me = this;
            this.viewSwitcher = new sk.ViewSwitcher({
                view: this,
                switchSubView: function(previous, current){
                    var prevCard = me.getChild(me.getSubViewId(previous));
                    if(prevCard){
                        prevCard.hide();
                    }
                    var curCard = me.getChild(me.getSubViewId(current));
                    if(curCard){
                        if(curCard.model.fetched){
                            if(curCard.rendered){
                                curCard.show();
                            }
                            else{
                                curCard.doRender().show();
                            }
                        }
                        else{
                            curCard.model.fetch();
                            curCard.show();
                        }
                    }
                }
            });

            this.model.addChild('nav', FindNavModel);
            var navView = new FindNavView({
                vid: 'nav',
                model: FindNavModel,
                prerendered: true,
                parent: this
            });
            this.addChild(navView);
        },
        afterRender: function() {
        },
        afterRenderChildren: function() {
        }
    });

    return FindView;
});