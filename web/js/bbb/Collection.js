define(['Underscore', 'Backbone'], function(_, bb) {
    var Collection = bb.Collection.extend({
        initialize: function(){
            this.cid = _.uniqueId('c');
            this.configure.apply(this, arguments);
        },
        configure: function(){}
    });
    return Collection;
});