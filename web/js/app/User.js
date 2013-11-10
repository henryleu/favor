define(['skeleton'], function(sk) {
    var User = sk.Model.extend({
        name: 'User',
        urlRoot: '/user',
        configure: function(){
        },
        init: function(user){
            this.set('_id', user.id);
            this.set('utoken', user.utoken);
            this.set('lFlg', user.lFlg);
            this.set('username', user.username);
            this.set('displayName', user.displayName);
            this.set('email', user.email);
            this.set('stt', user.stt);
            this.set('meta', user.meta);

            var creates = user.meta.creates;
            var createCount = 0;
            for(var thingId in creates){
                if(creates[thingId]){
                    createCount++;
                }
            }
            this.set('creates', createCount);

            var stars = user.meta.stars;
            var starCount = 0;
            for(var thingId in stars){
                if(stars[thingId]){
                    starCount++;
                }
            }
            this.set('stars', starCount);

            this.set('rptts', 0);
        }
    });
    return User;
});