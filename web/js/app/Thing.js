define(['jQuery', 'skeleton'], function($, sk) {
    var Thing = sk.Model.extend({
        name: 'Thing',
        urlRoot: '/thing',
        configure: function(){
            this.ensureUser();
            this.on('sync', this.onSync, this);
        },
        ensureUser: function() {
            window.user = window.user || {};
            window.user.meta = window.user.meta || {stars:{},likes:{}};
            this.user = window.user;
        },
        onSync: function(){
            this.fetched = true;
            var userMeta = this.user.meta;
            var thingId = this.id;

            //Init liked properties
            var liked = userMeta.likes[thingId]?true:false;
            this.set('liked', liked);

            //Init starred properties
            var starred = userMeta.stars[thingId]?true:false;
            this.set('starred', starred);

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
            var userMeta = this.user.meta;

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
                delete userMeta[this.id];
            }
            meta.likes = likes;

            this.set('liked', liked); //Update Thing.liked
        },
        toggleStar: function(starred){
            var meta = this.get('meta');
            var stars = meta.stars;
            var userMeta = this.user.meta;

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
                delete userMeta[this.id];
            }
            meta.stars = stars;

            this.set('starred', starred); //Update Thing.starred
        }
    });
    return Thing;
});