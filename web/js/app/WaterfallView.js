define(['Underscore', 'jQuery', 'skeleton', 'config', './UserHolder', './ThingCardView'],
    function(_, $, sk, config, UserHolder, ThingCardView) {
    var WaterfallView = sk.View.extend({
        templateName: 'waterfall-lane',
        prerendered: false,
        events: {
            "click .lane .acton span#like": "onToggleLike",
            "click .lane .acton span#star": "onToggleStar",
            "click .lane .acton span#delete": "onDelete",
            "click .lane .acton span#clone": "onClone"
        },
        doRender: function() {
            var input = {laneCount: this.laneCount};
            this.$el.html(this.evaluateTemplate( {input: input, id: this.getId()} ))
            this.afterRender();
            this.rendered = true;

            if(this.hidden) this.hide();
            else this.show();

            this.renderChildren();
            this.afterRenderChildren();
            return this;
        },
        renderChildren: function() {
            this.renderCards(this.model.models, false);
        },
        doRenderAppended: function(comingModels) {
            this.renderCards(comingModels, true);
        },
        renderCards: function(cards, appended) {
            var $el = this.$el.find('.lane ul');
            var laneCount = $el.length;

            //Init lane fragments
            var laneFragments = new Array(laneCount);
            for(var index = 0; index<laneCount; index++ ){
                laneFragments[index] = document.createDocumentFragment();
            }

            //Append a card to short lanes in order to make vertical alignment for each lane
            var shortLanes = this.computeShortLanes($el, appended);
            if(shortLanes.length>0){
                for(var index = 0; index<shortLanes.length; index++){
                    var shortLaneIndex = shortLanes[index];
                    cardView = this.addCardView(cards[index]);
                    laneFragments[shortLaneIndex].appendChild(cardView.el);
                }
            }

            //Add left cards to each lane fragment
            var shortLaneLen = shortLanes.length;
            var leftCardLen = cards.length-shortLaneLen;
            var cardView = null;
            var laneIndex = 0;
            for(var i = 0; i<leftCardLen; i++){
                laneIndex = i%laneCount;
                cardView = this.addCardView(cards[i+shortLaneLen]);
                laneFragments[laneIndex].appendChild(cardView.el);
            }

            //Append each lane fragment to lane's dom element
            for(var index = 0; index<laneCount; index++ ){
                $el[index].appendChild(laneFragments[index]);
            }
        },
        computeShortLanes: function(laneElements, appended) {
            var shortLanes = [];
            var laneCount = laneElements.length;

            /*
             *  Check if the coming elements is for appending,
             *  if not, no need to compute short lanes
             */
            if(!appended){
                return shortLanes;
            }

            //Get the heights of lanes
            var laneHeights = new Array(laneCount);
            for(var index = 0; index<laneCount; index++ ){
                var laneHeight = this.$(laneElements[index]).css('height');
                laneHeights[index] = parseInt(laneHeight);
            }

            //Compute max height and min height in the lanes
            var minHeight = 99999, maxHeight = -1;
            var laneHeight = -1;
            for(var index = 0; index<laneCount; index++ ){
                laneHeight = laneHeights[index];
                if(minHeight > laneHeights[index]){
                    minHeight = laneHeight;
                }
                if(maxHeight < laneHeights[index]){
                    maxHeight = laneHeight;
                }
            }

            //Figure out the short lanes which need to be append a extra card
            var heightValve = this.shortCardHeightValve;
            var bigDiff = maxHeight - minHeight > heightValve;
            if(bigDiff){
                for(var index = 0; index<laneCount; index++ ){
                    var heightDiff = laneHeights[index] - minHeight;
                    if(heightDiff < heightValve){
                        shortLanes.push(index);
                    }
                }
            }

            return shortLanes;
        },
        addCardView: function(card) {
            var cardView = new ThingCardView({
                vid: 'card-' + card.id,
                model: card,
                prerendered: false
            });
            cardView.doRender();
            this.addChild(cardView);
            return cardView;
        },
        configure: function() {
            this.laneCount = 3; //TODO: configure it or figure it out automatically
            this.shortCardHeightValve = config.collection.shortCardHeightValve;
            this.listenTo(this.model, 'add', this.onItemAdded, this);
            this.listenTo(this.model, 'remove', this.onItemRemoved, this);

            var me = this;
            this.listenTo(this.model, 'pull', function(model, comings) {
                console.log(comings.length + ' is pulled');
                me.doRender();
            });
            this.listenTo(this.model, 'append', function(model, comings) {
                me.doRenderAppended(comings);
                console.log(comings.length + ' is appended');
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