define(['jQuery', 'skeleton'], function($, sk) {
    var ThingDetailView = sk.View.extend({
        vid: 'thing-detail',
        templateName: 'thing-detail',
        events: {
            "click .snapshot .wrap span#like": "onToggleLike",
            "click .snapshot .wrap span#star": "onToggleStar",
            "click .showcase .actions a#star": "onToggleStar"
        },
        configure: function() {
            this.ensureUser();
            var me = this;
            this.listenTo(this.model, 'load', function(model) {
                me.doRender();
            });

            this.listenTo(this.model, 'change:liked', this.onRefreshLike, this);
            this.listenTo(this.model, 'change:starred', this.onRefreshStar, this);
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
            var $el = this.getTarget(e.target, '.snapshot .wrap span#like');
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
            var $el = this.$('.snapshot .wrap span#like');
            var meta = this.model.get('meta');
            var liked = value;
            var likes = meta.likes;
            if(liked){
                $el.addClass('visited');
                $el.find('i').removeClass('icon-thumbs-up-alt').addClass('icon-thumbs-up');
                $el.find('.text').html(' ('+likes + ')');
            }
            else{
                $el.removeClass('visited');
                $el.find('i').removeClass('icon-thumbs-up').addClass('icon-thumbs-up-alt');
                if(likes===0){
                    $el.find('.text').html('');
                }
                else{
                    $el.find('.text').html(' ('+likes + ')');
                }
            }
        },
        onToggleStar: function(e){
            var $el = this.getTarget(e.target, '.snapshot .wrap span#star');
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
//            var $el = this.$('.showcase .actions a#star');
            var $el = this.$('.snapshot .wrap span#star');
            var meta = this.model.get('meta');
            var starred = value;
            var stars = meta.stars;
            if(starred){
                $el.addClass('visited');
                $el.find('i').removeClass('icon-star-empty').addClass('icon-star');
                $el.find('.text').html(' ('+stars + ')');
            }
            else{
                $el.removeClass('visited');
                $el.find('i').removeClass('icon-star').addClass('icon-star-empty');
                if(stars===0){
                    $el.find('.text').html('');
                }
                else{
                    $el.find('.text').html(' ('+stars + ')');
                }
            }
        }

    });

    return ThingDetailView;
});