define(['jQuery', 'skeleton', './UserHolder'], function($, sk, UserHolder) {
    var Thing = sk.Model.extend({
        name: 'Thing',
        urlRoot: '/thing',
        configure: function(){
            this.on('sync', this.onSync, this);
        },
        onSync: function(){
            this.fetched = true;
//            var userMeta = UserHolder.get().get('meta');
            var user = UserHolder.get();
            var thingId = this.id;

            //Init liked property for view
            var liked = user.liked(thingId);
            this.set('liked', liked);

            //Init starred property for view
            var starred = user.starred(thingId);
            this.set('starred', starred);

            //Init created property for view
            var created = user.created(thingId);
            this.set('created', created);

            //Revise meta properties: likes, stars, etc.
            var meta = this.get('meta');
            var likes = meta.likes;
            if(!likes || likes < 0){
                likes = liked ? 1 : 0;
            }
            meta.likes = likes;

            var stars = meta.stars;
            if(!stars || stars < 0){
                stars = starred ? 1 : 0;
            }
            meta.stars = stars;

            this.trigger('load', this);
        },
        toggleLike: function(liked){
            var meta = this.get('meta');
            var likes = meta.likes;
            var user = UserHolder.get();

            /*
             * Update Thing.meta.likes and user.meta.likes
             */
            likes = (!likes || likes < 0) ? 0 : likes;
            if(liked){
                ++likes;
                user.like(this.id);
            }
            else{
                likes = --likes<=0 ? 0 : likes;
                user.unlike(this.id);
            }
            meta.likes = likes;

            this.set('liked', liked);
        },
        toggleStar: function(starred){
            var meta = this.get('meta');
            var stars = meta.stars;
            var user = UserHolder.get();

            /*
             * Update Thing.meta.stars and user.meta.stars
             */
            stars = (!stars || stars < 0) ? 0 : stars;
            if(starred){
                ++stars;
                user.star(this.id);
            }
            else{
                stars = --stars<=0 ? 0 : stars;
                user.unstar(this.id);
            }
            meta.stars = stars;

            this.set('starred', starred);
        },
        delete: function(deleted){
            var user = UserHolder.get();

            /*
             * Update Thing.meta.stars and user.meta.stars
             */
            if(deleted){
                user.delete(this.id);
            }
            else{
                user.create(this.id);
            }

            this.set('created', !deleted);
        }
    });
    return Thing;
});