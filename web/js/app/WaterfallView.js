define(['jQuery', 'skeleton'], function($, sk) {
    var WaterfallView = sk.View.extend({
        templateName: 'waterfall',
        events: {
            "click .lane .acton span#like": "onToggleLike",
            "click .lane .acton span#star": "onToggleStar"
        },
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                if(options.action=='read'){
                    me.model.fetched = true;
                    var len = me.model.length;
                    for(var i=0; i<len; i++){
                        var thing = me.model.at(i);
                        thing.onSync();
                        me.listenTo(thing, 'change:liked', me.onRefreshLike, me);
                        me.listenTo(thing, 'change:starred', me.onRefreshStar, me);
                    }
                    me.doRender();
                }
            });
        },
        getTarget: function(el, selector){
            var $el = $(el);
            return $el.is(selector) ? $el : $el.parents(selector);
        },
        onToggleLike: function(e){
            var $el = this.getTarget(e.target, '.lane .acton span#like');
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
                $el.addClass('active');
                $el.find('i').removeClass('icon-thumbs-up-alt').addClass('icon-thumbs-up');
            }
            else{
                $el.removeClass('active');
                $el.find('i').removeClass('icon-thumbs-up').addClass('icon-thumbs-up-alt');
            }
            $el.find('.text').html(likes===0 ? '' : likes);
        },
        onToggleStar: function(e){
            var $el = this.getTarget(e.target, '.lane .acton span#star');
            var thingId = $el.parent().parent().parent().find('#thingId').val();
            var thing = this.model.get(thingId);
            var starred = !thing.get('starred');
            thing.toggleStar(starred);
            var apiUrl = '/thing/' + thingId + (starred ? '/star' : '/unstar');
            $.get(apiUrl, function() {
            })
            .fail(function() {
                console.error('failed: ' + apiUrl);
                thing.toggleStar(!starred);
            });
        },
        onRefreshStar: function(model, value, options){
            var $el = this.$('.lane .thing input[value='+ model.id +']');
            var $el = $el.parent().find('span#star');
            var meta = model.get('meta');
            var starred = value;
            var stars = meta.stars;

            if(starred){
                $el.addClass('active');
                $el.find('i').removeClass('icon-star-empty').addClass('icon-star');
            }
            else{
                $el.removeClass('active');
                $el.find('i').removeClass('icon-star').addClass('icon-star-empty');
            }
            $el.find('.text').html(stars===0 ? '' : stars);
        }
    });

    return WaterfallView;
});