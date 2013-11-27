define(['jQuery', 'skeleton', './UserHolder', './Thing'], function($, sk, UserHolder, Thing) {
    var ThingCardView = sk.View.extend({
        templateName: 'waterfall-card',
        events: {
            "click .acton span#like": "onToggleLike",
            "click .acton span#star": "onToggleStar",
            "click .acton span#delete": "onDelete",
            "click .acton span#clone": "onClone"
        },
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'change:liked', this.onRefreshLike, this);
            this.listenTo(this.model, 'change:starred', this.onRefreshStar, this);
            this.listenTo(this.model, 'update', function() {
                me.doRender();
            });
        },
        destroy: function() {
            this.undelegateEvents().remove();
        },
        onToggleLike: function(e){
            var thing = this.model;
            var thingId = thing.id;
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
            var $el = this.$el.find('span#like');
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
            var thing = this.model;
            var thingId = thing.id;
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
            var $el = this.$el.find('span#star');
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
        },
        onDelete: function(e){
            var thing = this.model;
            var thingId = thing.id;
            thing.destroy({
                success: function(model, response) {
                    UserHolder.get().delete(thingId);
                },
                error: function(model, response) {
                }
            });
        },
        onClone: function(e){
            var thing = this.model;
            var thingId = thing.id;
            var apiUrl = '/thing/' + thingId + '/clone';
            $.get(apiUrl, function(result) {
                console.log(result); //TODO
            })
                .fail(function() {
                    console.error('failed: ' + apiUrl);
                });
        }
    });
    ThingCardView.makeVid = function(id){
        return 'card' + id;
    };
    return ThingCardView;
});