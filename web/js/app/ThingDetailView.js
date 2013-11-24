define(['jQuery', 'skeleton'], function($, sk) {
    var ThingDetailView = sk.View.extend({
        vid: 'thing-detail',
        templateName: 'thing-detail',
        events: {
            "click .showcase .acton span#like": "onToggleLike",
            "click .showcase .acton span#star": "onToggleStar"
        },
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'load update', function(model) {
                me.doRender();
            });

            this.listenTo(this.model, 'change:liked', this.onRefreshLike, this);
            this.listenTo(this.model, 'change:starred', this.onRefreshStar, this);
        },
        getTarget: function(el, selector){
            var $el = $(el);
            return $el.is(selector) ? $el : $el.parents(selector);
        },
        onToggleLike: function(e){
            var $el = this.getTarget(e.target, '.showcase .acton span#like');
            if($el.length==0) return;
            var liked = !this.model.get('liked');
            this.model.toggleLike(liked);
            var me = this;
            var apiUrl = '/thing/' + this.model.id + (liked ? '/like' : '/unlike');
            $.get(apiUrl, function() {
            })
            .fail(function() {
                console.error('failed: ' + apiUrl);
                me.model.toggleLike(!liked);
            });
        },
        onRefreshLike: function(model, value, options){
            var $el = this.$('.showcase .acton span#like');
            var meta = this.model.get('meta');
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
            var $el = this.getTarget(e.target, '.showcase .acton span#star');
            if($el.length==0) return;
            var starred = !this.model.get('starred');
            this.model.toggleStar(starred);
            var me = this;
            var apiUrl = '/thing/' + this.model.id + (starred ? '/star' : '/unstar');
            $.get(apiUrl, function() {
            })
            .fail(function() {
                console.error('failed: ' + apiUrl);
                me.model.toggleStar(!starred);
            });
        },
        onRefreshStar: function(model, value, options){
            var $el = this.$('.showcase .acton span#star');
            var meta = this.model.get('meta');
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

    return ThingDetailView;
});