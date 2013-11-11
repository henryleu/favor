define(['skeleton'], function(sk) {
    var User = sk.Model.extend({
        name: 'User',
        urlRoot: '/user',
        configure: function(){
        },
        created: function(id){
            return this.get('meta').creates[id] ? true : false;
        },
        create: function(id){
            this.get('meta').creates[id] = new Date().getTime();
            var creates = this.get('creates');
            this.set('creates', ++creates);
        },
        delete: function(id){
            this.get('meta').creates[id] = null;
            var creates = this.get('creates');
            this.set('creates', --creates);
        },
        starred: function(id){
            return this.get('meta').stars[id] ? true : false;
        },
        star: function(id){
            this.get('meta').stars[id] = new Date().getTime();
            var stars = this.get('stars');
            this.set('stars', ++stars);
        },
        unstar: function(id){
            this.get('meta').stars[id] = null;
            var stars = this.get('stars');
            this.set('stars', --stars);
        },
        liked: function(id){
            return this.get('meta').likes[id] ? true : false;
        },
        like: function(id){
            this.get('meta').likes[id] = new Date().getTime();
            var likes = this.get('likes');
            this.set('likes', ++likes);
        },
        unlike: function(id){
            this.get('meta').likes[id] = null;
            var likes = this.get('likes');
            this.set('likes', --likes);
        },
        init: function(user){
            this.set('_id', user.id);
            this.set('id', user.id);
            this.set('utoken', user.utoken);
            this.set('lFlg', user.lFlg);
            this.set('username', user.username);
            this.set('displayName', user.displayName);
            this.set('email', user.email);
            this.set('stt', user.stt);
            this.set('meta', user.meta);

            var creates = user.meta.creates;
            var createCount = this.countKeys(creates, true);
            this.set('creates', createCount);

            var stars = user.meta.stars;
            var starCount = this.countKeys(stars, true);
            this.set('stars', starCount);

            var likes = user.meta.likes;
            var likeCount = this.countKeys(likes, true);
            this.set('likes', likeCount);

            this.set('rptts', 0);
        },
        countKeys: function(map, notNull){
            var count = 0;
            for(var p in map){
                if(notNull){
                   if(map[p]) count++;
                }
                else{
                    count++;
                }
            }
            return count;
        }
    });
    return User;
});