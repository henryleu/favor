define(['jQuery', 'skeleton'],
function($, sk) {
    var HomeView = sk.View.extend({
        vid: 'home',
        templateName: 'home'
    });

    return HomeView;
});