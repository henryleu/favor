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
            var me = this;
            var checkAndFindMoreHandler = function(){
                me.checkAndFindMore();
            };

            this.listenTo(this.model, 'touch-end', function(end){
                if(end){
                    if(me.onCheckAndFindMore){
                        $(window).off('scroll', checkAndFindMoreHandler);
                        me.onCheckAndFindMore = false;
                    }
                }
                else{
                    if(!me.onCheckAndFindMore){
                        $(window).scroll(checkAndFindMoreHandler);
                        me.onCheckAndFindMore = true;
                    }
                }
            });

            $(window).scroll(function(){
                me.checkAndShowGotoTop();
            });
        },
        checkAndShowGotoTop: function() {
            var scrolledTop = document.documentElement.scrollTop + document.body.scrollTop;
            var $gotoTop = this.$('.gotoTop');
            if(scrolledTop>this.beyondTop){
                $gotoTop.removeClass('disabled');
            }else{
                $gotoTop.addClass('disabled');
            }
        },
        checkAndFindMore: function() {
            var scrolledTop = document.documentElement.scrollTop + document.body.scrollTop;
            var scrolledBottom = document.body.scrollHeight - scrolledTop - document.body.clientHeight;
            if(scrolledBottom<this.beyondBottom){
//console.log('appending');//TODO: pagination
                this.model.findMore();
            }
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