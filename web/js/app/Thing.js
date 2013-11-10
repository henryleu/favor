define(['jQuery', 'skeleton'], function($, sk) {
    var Thing = sk.Model.extend({
        name: 'Thing',
        urlRoot: '/thing',
        configure: function(){
            this.on('sync', this.onSync, this);
        },
        onSync: function(){
            this.fetched = true;
            var userMeta = window.user.meta;
            var thingId = this.id;

            //Init liked properties
            var liked = userMeta.likes[thingId]?true:false;
            this.set('liked', liked);

            //Init starred properties
            var starred = userMeta.stars[thingId]?true:false;
            this.set('starred', starred);

            //Init deletable properties
            var deletable = userMeta.creates[thingId]?true:false;
            this.set('deletable', deletable);

            //Revise meta properties: likes, stars, etc.
            var meta = this.get('meta');
            var likes = meta.likes;
            if(!likes || likes < 0){
                likes = liked ? 1 : 0;
            }
            meta.likes = likes;

            var stars = meta.stars;
            if(!stars || stars < 0){
                stars = stars ? 1 : 0;
            }
            meta.stars = stars;

            this.trigger('load', this);
        },
        toggleLike: function(liked){
            var meta = this.get('meta');
            var likes = meta.likes;
            var userMeta = window.user.meta;

            /*
             * Update Thing.meta.likes and user.meta.likes
             */
            likes = (!likes || likes < 0) ? 0 : likes;
            if(liked){
                ++likes;
                userMeta[this.id] = new Date().getTime();
            }
            else{
                likes = --likes<=0 ? 0 : likes;
                userMeta[this.id] = null;
            }
            meta.likes = likes;

            this.set('liked', liked);
        },
        toggleStar: function(starred){
            var meta = this.get('meta');
            var stars = meta.stars;
            var userMeta = window.user.meta;

            /*
             * Update Thing.meta.stars and user.meta.stars
             */
            stars = (!stars || stars < 0) ? 0 : stars;
            if(starred){
                ++stars;
                userMeta[this.id] = new Date().getTime();
            }
            else{
                stars = --stars<=0 ? 0 : stars;
                userMeta[this.id] = null;
            }
            meta.stars = stars;

            this.set('starred', starred);
        },
        delete: function(deleted){
            var userMeta = window.user.meta;

            /*
             * Update Thing.meta.stars and user.meta.stars
             */
            if(deleted){
                userMeta[this.id] = null;
            }
            else{
                userMeta[this.id] = true; //TODO: use true instead of created time, mind it later if it leads error
            }

            this.set('deletable', !deleted);
        }
    });
    return Thing;
});