define(['jQuery', 'skeleton'],
function($, sk) {
    var AboutView = sk.View.extend({
        vid: 'about',
        templateName: 'about'
    });

    return AboutView;
});