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
//            var stared = userMeta.stars[thingId]?true:false;
            var liked = userMeta.likes[thingId]?true:false;
//            this.set('stared', stared);
            this.set('liked', liked);

            //Revise meta properties: likes, stars, etc.
            var meta = this.get('meta');
            var likes = meta.likes;
            if(!likes || likes < 0){
                likes = liked ? 1 : 0;
            }
            meta.likes = likes;

            this.trigger('load', this);
        },
        toggleLike: function(liked){
            var meta = this.get('meta');
            var likes = meta.likes;
            var userMeta = this.user.meta;

            //update Thing.meta.likes
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

            //update Thing.liked
            this.set('liked', liked);
        }
    });
    return Thing;
});