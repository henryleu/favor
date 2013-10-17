define(['jQuery', 'skeleton'],
function($, sk) {
    var UserView = sk.View.extend({
        vid: 'user',
        templateName: 'user'
    });

    return UserView;
});