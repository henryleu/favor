define(['./Repository', './User'],
function(Repository, User) {
    window.user = window.user || {};
    window.user.meta = window.user.meta || {creates:{},stars:{},likes:{}};
    var uid = window.user.id;
    var user = new User();
    user.fetched = true;
    user.init(window.user);
    Repository.put('user', uid, user);
    var UserHolder = {
        get: function(){
            return Repository.get('user', uid);
        }
    };
    return UserHolder;
});