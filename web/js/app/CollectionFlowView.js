define(['Underscore','jQuery', 'skeleton'],
function(_, $, sk) {
    var FlowCtrlView = sk.View.extend({
        vid: 'collection-flow',
        templateName: 'collection-flow',
        events: {
            'click .refresh': 'refresh',
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
                    $gotoTop.removeClass('disabled');
//                    $gotoTop.fadeIn(400);
                }else{
                    $gotoTop.addClass('disabled');
//                    $gotoTop.stop().fadeOut(400);
                }
            });
        },
        refresh: function(e) {
            this.getParent().refresh();
        },
        gotoTop: function(e){
            $("html,body").animate({scrollTop:"0px"},200);
        }
    });
    FlowCtrlView.defaults = {
        beyondHeight: 100
    };
    return FlowCtrlView;
});