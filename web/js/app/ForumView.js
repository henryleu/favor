define(['jQuery', 'skeleton'],
function($, sk) {
    var ForumView = sk.View.extend({
        vid: 'forum',
        templateName: 'forum'
    });

    return ForumView;
});