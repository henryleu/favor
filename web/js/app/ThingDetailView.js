define(['jQuery', 'skeleton'], function($, sk) {
    var ThingDetailView = sk.View.extend({
        vid: 'thing-detail',
        templateName: 'thing-detail',
        events: {
            "click .snapshot .wrap span#like": "onToggleLike",
            "click .showcase .actions a#star": "onStar"
        },
        configure: function() {
            this.ensureUser();
            var me = this;
            this.listenTo(this.model, 'load', function(model) {
                me.doRender();
            });

            this.listenTo(this.model, 'change:istar', this.doStar, this);
            this.listenTo(this.model, 'change:liked', this.onRefreshLike, this);
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

    return ThingDetailView;
});