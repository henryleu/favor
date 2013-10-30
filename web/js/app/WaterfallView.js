define(['jQuery', 'skeleton'], function($, sk) {
    var WaterfallView = sk.View.extend({
        templateName: 'waterfall',
        events: {
            "click .lane .wrap span#like": "onToggleLike"
        },
        configure: function() {
            this.ensureUser();
            var me = this;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                if(options.action=='read'){
                    me.model.fetched = true;
                    var len = me.model.length;
                    for(var i=0; i<len; i++){
                        var thing = me.model.at(i);
                        thing.onSync();
                        me.listenTo(thing, 'change:liked', me.onRefreshLike, me);
                    }
                    me.doRender();
                }
            });
        },
        ensureUser: function() {
            window.user = window.user || {};
            window.user.meta = window.user.meta || {stars:{},likes:{}};
            this.user = window.user;
        },
        getTarget: function(el, selector){
            var $el = $(el);
            return $el.is(selector) ? $el : $el.parents(selector);
        },
        onToggleLike: function(e){
            var $el = this.getTarget(e.target, '.lane .wrap span#like');
            var thingId = $el.parent().parent().parent().find('#thingId').val();
            var thing = this.model.get(thingId);
            var liked = !thing.get('liked');
            thing.toggleLike(liked);
            var apiUrl = '/thing/' + thingId + (liked ? '/like' : '/unlike');
            $.get(apiUrl, function() {
            })
            .fail(function() {
                console.error('failed: ' + apiUrl);
                thing.toggleLike(!liked);
            });
        },
        onRefreshLike: function(model, value, options){
            var $el = this.$('.lane .thing input[value='+ model.id +']');
            var $el = $el.parent().find('span#like');
            var meta = model.get('meta');
            var liked = value;
            var likes = meta.likes;

            if(liked){
                $el.addClass('visited');
                $el.find('.text').html(' ('+likes + ')');
            }
            else{
                $el.removeClass('visited');
                if(likes===0){
                    $el.find('.text').html('');
                }
                else{
                    $el.find('.text').html(' ('+likes + ')');
                }
            }
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
        }
    });

    return WaterfallView;
});