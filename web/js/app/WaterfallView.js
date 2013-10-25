define(['jQuery', 'skeleton'], function($, sk) {
    var WaterfallView = sk.View.extend({
        templateName: 'waterfall',
        events: {
            "click .lane .wrap span#like": "onLike"

//            "focus .thing": "onFocus",
//            "mouseenter .thing": "onFocus",
//            "mouseover .thing": "onFocus",
//            "mouseleave": "onUnfocus"
        },
        configure: function() {
            var userMeta = window.user && window.user.meta ? window.user.meta : {stars:{},likes:{}};

            var me = this;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                if(options.action=='read'){
                    me.model.fetched = true;

                    var len = me.model.length;
                    for(var i=0; i<len; i++){
                        var thing = me.model.at(i);
                        var thingId = thing.id;
                        var stared = userMeta.stars[thingId]?true:false;
                        var liked = userMeta.likes[thingId]?true:false;
//                thing.set('istar', stared);
//                this.listenTo(thing, 'change:istar', this.doStar, this);
                        thing.set('ilike', liked);
                        me.listenTo(thing, 'change:ilike', me.doLike, me);
                    }
                    me.doRender();
                }
            });
        },
        getTarget: function(el, selector){
            var $el = $(el);
            return $el.is(selector) ? $el : $el.parents(selector);
        },
        onLike: function(e){
            var $el = this.getTarget(e.target, '.lane .wrap span#like');
            var thingId = $el.parent().parent().parent().find('#thingId').val();
            var thing = this.model.get(thingId);
            thing.set('ilike', !thing.get('ilike'));
        },
        doLike: function(model, value, options){
            var $el = this.$('.lane .thing input[value='+ model.id +']');
            var $el = $el.parent().find('span#like');
            var visited = value;
            var id = model.id;
            var apiUrl = '/thing/' + id + (visited ? '/like' : '/unlike');
            $.get(apiUrl, function() {
                console.debug('succeed: ' + apiUrl);
                //TODO:
            })
                .fail(function() {
                    console.error('failed: ' + apiUrl);
                    //TODO:
                });

            var meta = model.toJSON().meta;
            var likes = meta.likes;
            likes = !likes ? 0 : likes;
            if(visited){
                ++likes;
                $el.addClass('visited');
                $el.find('.text').html(' ('+likes + ')');
            }
            else{
                likes = --likes<=0 ? 0 : likes;
                $el.removeClass('visited');
                if(likes===0){
                    $el.find('.text').html('');
                }
                else{
                    $el.find('.text').html(' ('+likes + ')');
                }
            }
            meta.likes = likes;
            model.set('meta', meta);
        },
        onStar: function(e){
            this.model.set('istar', !this.model.get('istar'));
        },
        doStar: function(model, value, options){
            var $el = this.$('.showcase .actions a#star');
            var active = value;
            var id = model.id;
            var apiUrl = '/thing/' + id + (active ? '/star' : '/unstar');
            $.get(apiUrl, function() {
                console.debug('succeed: ' + apiUrl);
                //TODO:
            })
                .fail(function() {
                    console.error('failed: ' + apiUrl);
                    //TODO:
                });

            if(active){
                $el.addClass('active');
                $el.find('i').removeClass('icon-star-empty').addClass('icon-star');
            }
            else{
                $el.removeClass('active');
                $el.find('i').removeClass('icon-star').addClass('icon-star-empty');
            }
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