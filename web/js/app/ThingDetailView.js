define(['jQuery', 'skeleton'], function($, sk) {
    var ThingDetailView = sk.View.extend({
        vid: 'thing-detail',
        templateName: 'thing-detail',
        events: {
            "click .snapshot .wrap span#like": "onLike",
            "click .showcase .actions a#favor": "onFavor"
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
        getTarget: function(el, selector){
            var $el = $(el);
            return $el.is(selector) ? $el : $el.parents(selector);
        },
        onLike: function(e){
            var $el = this.getTarget(e.target, '.snapshot .wrap span#like');
            var visited = $el.toggleClass('visited').hasClass('visited');
            var meta = this.model.toJSON().meta;
            var likes = meta.likes;
            likes = !likes ? 0 : likes;
            if(visited){
                ++likes;
                $el.find('.text').html(' ('+likes + ')');
            }
            else{
                likes = --likes<=0 ? 0 : likes;
                if(likes===0){
                    $el.find('.text').html('');
                }
                else{
                    $el.find('.text').html(' ('+likes + ')');
                }
            }
            meta.likes = likes;
            this.model.set('meta', meta);
            //TODO
        },
        onFavor: function(e){
            var $el = this.getTarget(e.target, '.showcase .actions a#favor');
            var active = $el.toggleClass('active').hasClass('active');
            if(active){
                $el.find('i').removeClass('icon-star-empty').addClass('icon-star');
            }
            else{
                $el.find('i').removeClass('icon-star').addClass('icon-star-empty');
            }
            //TODO
        }

    });

    return ThingDetailView;
});