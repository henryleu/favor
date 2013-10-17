define(['Underscore', 'Backbone'],
function(_, bb) {
    var Skeleton = {};
    _.extend(Skeleton, bb);

    Skeleton.sync = function() {
        arguments[2].action = arguments[0];
        return bb.sync.apply(this, arguments);
    };

    return Skeleton;
});