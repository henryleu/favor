define(['jQuery', 'skeleton'], function($, sk) {
    var WaterfallView = sk.View.extend({
        templateName: 'waterfall',
        events: {
//            "focus .thing": "onFocus",
//            "mouseenter .thing": "onFocus",
//            "mouseover .thing": "onFocus",
//            "mouseleave": "onUnfocus"
        },
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                if(options.action=='read'){
                    me.model.fetched = true;
                    me.doRender();
                }
            });
        },
        focus: function($el){
            if(!this.theFocus){
                this.setFocus($el, true);
                this.theFocus = $el;
            }
            else if(this.theFocus.get(0)===$el.get(0)){
                return;
            }
            else{
                this.setFocus(this.theFocus, false);
                this.setFocus($el, true);
                this.theFocus = $el;
            }
        },
        unfocus: function(){
            if(this.theFocus){
                this.setFocus(this.theFocus, false);
                this.theFocus = null;
            }
        },
        setFocus: function($el, focused){
            var shrink = 82;
            var duration = 200;
            if(focused){
                var imgRect = {
                    width: $el.find('img').width(),
                    height: $el.find('img').height()
                };
                var offset = (imgRect.height/imgRect.width*shrink-82)/2;
                var focusImgStyles = {marginLeft: "41px", marginRight: "41px", width: "242px"};//244px
                var paddingStyles = {marginTop: ''+offset+'px'};

                var focus = function(){
                    $el.parent().addClass('focus');
                };
                $el.find('img').animate(focusImgStyles, {queue:false, duration:duration, complete:focus});
                $el.find('.top-img-padding').animate(paddingStyles, {queue:false, duration:duration});
                $el.find('.bottom-img-padding').animate(paddingStyles, {queue:false, duration:duration});
                $el.find('.meta').slideDown({queue:false, duration:duration});
                $el.find('.desc').slideDown({queue:false, duration:duration});
            }
            else{
                var unfocusImgStyles = {marginLeft: "0px", marginRight: "0px", width: "324px"};
                var paddingStyles = {marginTop: '0px'};

                var unfocus = function(){
                    $el.parent().removeClass('focus');
                };
                $el.find('img').animate(unfocusImgStyles, {queue:false, duration:duration, complete:unfocus});
                $el.find('.top-img-padding').animate(paddingStyles, {queue:false, duration:duration});
                $el.find('.bottom-img-padding').animate(paddingStyles, {queue:false, duration:duration});
                $el.find('.meta').slideUp({queue:false, duration:duration});
                $el.find('.desc').slideUp({queue:false, duration:duration});
            }
        },
        onFocus: function(e){
            var $el = this.getTarget(e.target, 'div.thing');
            if(!$el.length) return true;
            this.focus($el);
        },
        onUnfocus: function(e){
            this.unfocus();
        },
        getTarget: function(el, selector){
            var $el = $(el);
            return $el.is(selector) ? $el : $el.parents(selector);
        },
       onDelegateEvents: function(){
            this.$('.thing').on('mouseenter', this.onMouseIn);
            this.$('.thing').on('mouseleave', this.onMouseOut);
        }
    });

    return WaterfallView;
});