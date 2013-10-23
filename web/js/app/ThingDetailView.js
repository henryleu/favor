define(['jQuery', 'skeleton'], function($, sk) {
    var ThingDetailView = sk.View.extend({
        vid: 'thing-detail',
        templateName: 'thing-detail',
        events: {
            "click .snapshot .wrap span#like": "onLike",
            "click .showcase .actions a#star": "onStar"
        },
        configure: function() {
            var me = this;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                if(options.action=='read'){
                    me.model.fetched = true;
                    me.doRender();
                }
            });
            var userMeta = window.user && window.user.meta ? window.user.meta : {stars:{},likes:{}};
            var thingId = this.model.id;
            var stared = userMeta.stars[thingId]?true:false;
            var liked = userMeta.likes[thingId]?true:false;

            this.model.set('istar', stared);
            this.listenTo(this.model, 'change:istar', this.doStar, this);

            this.model.set('ilike', liked);
            this.listenTo(this.model, 'change:ilike', this.doLike, this);
        },
        getTarget: function(el, selector){
            var $el = $(el);
            return $el.is(selector) ? $el : $el.parents(selector);
        },
        onLike: function(e){
            this.model.set('ilike', !this.model.get('ilike'));
        },
        doLike: function(model, value, options){
            var $el = this.$('.snapshot .wrap span#like');
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

            var meta = this.model.toJSON().meta;
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
            this.model.set('meta', meta);
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