define(['jQuery', 'skeleton', './UserHolder'], function($, sk, UserHolder) {
    var ThingsCreatedView = sk.View.extend({
        vid: 'things-created',
        templateName: 'things-created',
        events: {
            "click .list .acton span#like": "onToggleLike",
            "click .list .acton span#star": "onToggleStar",
            "click .list .acton span#delete": "onDelete",
            "click .list .acton span#clone": "onClone"
        },
        configure: function() {
            this.listenTo(this.model, 'add', this.onItemAdded, this);
            this.listenTo(this.model, 'remove', this.onItemRemoved, this);

            var me = this;
            this.listenTo(this.model, 'sync', function(model, res, options) {
                if(options.action=='read'){
                    me.model.fetched = true;
                    me.doRender();
                }
            });
            this.listenTo(this.model, 'add', this.onAddThing, this);
            this.listenTo(this.model, 'remove', this.onRemoveThing, this);
        },
        onItemAdded: function(model, collection, options){
            model.onSync();
            this.listenTo(model, 'change:liked', this.onRefreshLike, this);
            this.listenTo(model, 'change:starred', this.onRefreshStar, this);
            console.log(model.get('sDesc') + ' is added');
        },
        onItemRemoved: function(model, collection, options){
            this.stopListening(model);
            console.log(model.get('sDesc') + ' is removed');
        },
        getTarget: function(el, selector){
            var $el = $(el);
            return $el.is(selector) ? $el : $el.parents(selector);
        },
        onToggleLike: function(e){
            var $el = this.getTarget(e.target, '.list .acton span#like');
            var thingId = $el.parent().parent().parent().parent().parent().find('#thingId').val();
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
            var $el = this.$('.list .thing input[value='+ model.id +']');
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
            var $el = this.getTarget(e.target, '.list .acton span#star');
            var thingId = $el.parent().parent().parent().parent().parent().find('#thingId').val();
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
            var $el = this.$('.list .thing input[value='+ model.id +']');
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
        },
        onDelete: function(e){
            var $el = this.getTarget(e.target, '.list .acton span#delete');
            var thingId = $el.parent().parent().parent().parent().parent().find('#thingId').val();
            var thing = this.model.get(thingId);
            thing.destroy({
                success: function(model, response) {
                    UserHolder.get().delete(thingId);
                },
                error: function(model, response) {
                }
            });
        },
        onClone: function(e){
            var $el = this.getTarget(e.target, '.list .acton span#clone');
            var thingId = $el.parent().parent().parent().parent().parent().find('#thingId').val();
            var thing = this.model.get(thingId);
            var apiUrl = '/thing/' + thingId + '/clone';
            $.get(apiUrl, function(a, b, c) {
                console.log(a);
            })
            .fail(function() {
                console.error('failed: ' + apiUrl);
            });
        },
        onAddThing: function(model, collection, options){
            //TODO  add the thing dom
        },
        onRemoveThing: function(model, collection, options){
            var $el = this.$('.list .thing input[value='+ model.id +']');
            var $el = $el.parent().parent().parent().parent().remove();
        }
    });

    return ThingsCreatedView;
});