define(['Underscore','jQuery', 'skeleton'],
function(_, $, sk) {
    var FlowCtrlView = sk.View.extend({
        vid: 'flow-ctrl',
        templateName: 'flow-ctrl',
        events: {
            'click .gotoTop': 'gotoTop'
        },
        configure: function(){
            _.defaults(this, FlowCtrlView.defaults);
            var beyondHeight = this.beyondHeight;
            var me = this;
            $(window).scroll(function(){
                var scrolledTop = document.documentElement.scrollTop + document.body.scrollTop;
                var $gotoTop = me.$('.gotoTop');
                if(scrolledTop>beyondHeight){
                    $gotoTop.fadeIn(400);
                }else{
                    $gotoTop.stop().fadeOut(400);
                }
            });
        },
        afterRender: function() {
        },
        gotoTop: function(e){
            $("html,body").animate({scrollTop:"0px"},200);
        }
    });
    FlowCtrlView.defaults = {
        beyondHeight: 10
    };
    return FlowCtrlView;
});