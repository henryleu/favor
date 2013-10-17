define(['jQuery', 'skeleton', './FindNavModel', './FindNavView', './FlowCtrlModel', './FlowCtrlView', './Showcase', './ShowcaseView', './ThingsAuto', './ThingsAutoView', './ThingsNew', './ThingsNewView', './ThingsHot', './ThingsHotView'],
function($, sk, FindNavModel, FindNavView, FlowCtrlModel, FlowCtrlView, Showcase, ShowcaseView, ThingsAuto, ThingsAutoView, ThingsNew, ThingsNewView, ThingsHot, ThingsHotView) {
    var FindView = sk.View.extend({
        vid: 'find',
        templateName: 'find',
        getSubViewId: function(name){
            if(name=='showcase'){
                return name;
            }
            else{
                return 'things-' + name;
            }
        },
        configure: function() {
            //The flow controls view on the right bottom
            this.model.addChild('flowCtrl', FlowCtrlModel);
            var flowCtrlView = new FlowCtrlView({
                model: FlowCtrlModel,
                hidden: false,
                prerendered: true
            });
            this.addChild(flowCtrlView);

            //The Showcase view which control thing detail view
            var showcase = new Showcase({});
            this.model.addChild('showcase', showcase);
            var showcaseView = new ShowcaseView({
                model: showcase,
                parent: this,
                hidden: true,
                prerendered: true
            });
            this.addChild(showcaseView);

            //The Thing collection view which is recommended automatically
            var subModel, subView;
            subModel = new ThingsAuto();
            this.model.addChild('auto', subModel);
            subView = new ThingsAutoView({
                model: subModel,
                hidden: true,
                prerendered: true
            });
            this.addChild(subView);

            //The Thing collection view which is newest (order by time)
            subModel = new ThingsNew();
            this.model.addChild('new', subModel);
            subView = new ThingsNewView({
                model: subModel,
                hidden: true,
                prerendered: true
            });
            this.addChild(subView);

            //The Thing collection view which is hottest (order by like)
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
                    console.info(previous +' -> '+ current);
                    var prevCard = me.getChild(me.getSubViewId(previous));
                    if(prevCard){
                        prevCard.hide();
                    }
                    var curCard = me.getChild(me.getSubViewId(current));
                    if(curCard){
                        if(current=='showcase'){
                            curCard.render(true).show();
                        }
                        else{
                            curCard.render(true).show();
                        }
                    }
                }
            });

            //The vertical flow navigation view on the left
            this.model.addChild('nav', FindNavModel);
            var navView = new FindNavView({
                vid: 'nav',
                model: FindNavModel,
                prerendered: true,
                parent: this
            });
            this.addChild(navView);

            /*
             * bind all events
             */

        },
        afterRender: function() {
        },
        afterRenderChildren: function() {
        }
    });

    return FindView;
});