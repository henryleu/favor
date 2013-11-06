define(['skeleton'], function(sk) {
    var User = sk.Model.extend({
        name: 'User',
        urlRoot: '/user',
        configure: function(){
        }
    });
    return User;
});