define(['Underscore','jQuery', 'skeleton'],
function(_, $, sk) {
    var CollectionFlowView = sk.View.extend({
        vid: 'collection-flow',
        templateName: 'collection-flow',
        events: {
            'click .refresh': 'refresh',
            'click .gotoTop': 'gotoTop'
        },
        configure: function(){
            _.defaults(this, CollectionFlowView.defaults);
            var beyondTop = this.beyondTop;
            var beyondBottom = this.beyondBottom;
            var me = this;
            $(window).scroll(function(){
                var scrolledTop = document.documentElement.scrollTop + document.body.scrollTop;
                var $gotoTop = me.$('.gotoTop');
                if(scrolledTop>beyondTop){
                    $gotoTop.removeClass('disabled');
//                    $gotoTop.fadeIn(400);
                }else{
                    $gotoTop.addClass('disabled');
//                    $gotoTop.stop().fadeOut(400);
                }

                var scrolledBottom = document.body.scrollHeight - scrolledTop - document.body.clientHeight;
                if(scrolledBottom<beyondBottom){
//                    console.log('appending');//TODO: pagination
                    me.model.findMore();
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
    CollectionFlowView.defaults = {
        beyondTop: 100,
        beyondBottom: 200
    };
    return CollectionFlowView;
});