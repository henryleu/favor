define(['jQuery', 'skeleton'],
function($, sk) {
    var ShareView = sk.View.extend({
        vid: 'share',
        templateName: 'share'
    });

    return ShareView;
});