define(['Underscore', 'jQuery', 'skeleton', 'config', './UserHolder', './ThingCardView'],
    function(_, $, sk, config, UserHolder, ThingCardView) {
    var WaterfallView = sk.View.extend({
        templateName: 'waterfall-lane',
        prerendered: false,
        events: {
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
        },
        onItemAdded: function(model, collection, options){
//console.error(model.id + ' is added');
        },
        onItemRemoved: function(model, collection, options){
//console.error(model.id + ' is removed');
            this.removeCardView(model);
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
                vid: ThingCardView.makeVid(card.id),
                model: card
            });
            cardView.doRender();
            this.addChild(cardView);
            return cardView;
        },
        removeCardView: function(card) {
            var vid = ThingCardView.makeVid(card.id);
            var cardView = this.getChild(vid);
            if(cardView){
                this.removeChild(vid);
                cardView.destroy();
            }
        }
    });

    return WaterfallView;
});

