define(['Underscore','jQuery', 'skeleton', './UserHolder'], function(_, $, sk, UserHolder) {
    var WaterfallView = sk.View.extend({
        templateName: 'waterfall',
        events: {
            "click .lane .acton span#like": "onToggleLike",
            "click .lane .acton span#star": "onToggleStar",
            "click .lane .acton span#delete": "onDelete",
            "click .lane .acton span#clone": "onClone"
        },
        configure: function() {
            this.listenTo(this.model, 'add', this.onItemAdded, this);
            this.listenTo(this.model, 'remove', this.onItemRemoved, this);

            var me = this;
            this.listenTo(this.model, 'pull', function(model, comings) {
                console.log(comings.length + ' is pulled');
                me.doRender();
            });
            this.listenTo(this.model, 'append', function(model, comings) {
//                me.doRenderAppended(); //TODO
                console.log(comings.length + ' is appended');
                console.log(comings);
            });
            this.listenTo(this.model, 'add', this.onAddThing, this);
            this.listenTo(this.model, 'remove', this.onRemoveThing, this);
        },
        onItemAdded: function(model, collection, options){
            this.listenTo(model, 'change:liked', this.onRefreshLike, this);
            this.listenTo(model, 'change:starred', this.onRefreshStar, this);
        },
        onItemRemoved: function(model, collection, options){
            this.stopListening(model);
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
//            console.log('thing collection: ' + _.pluck(this.model.models, 'id').join(' - '));
//            console.log('thing collection: ' + thingId);
//            console.log(thing);
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
        },
        onDelete: function(e){
            var $el = this.getTarget(e.target, '.lane .acton span#delete');
            var thingId = $el.parent().parent().parent().find('#thingId').val();
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
            var $el = this.getTarget(e.target, '.lane .acton span#clone');
            var thingId = $el.parent().parent().parent().find('#thingId').val();
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
            var $el = this.$('.lane .thing input[value='+ model.id +']');
            var $el = $el.parent().parent().parent().parent().remove();
        }
    });

    return WaterfallView;
});