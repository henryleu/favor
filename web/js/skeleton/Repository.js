define(['Underscore', 'Backbone'],
function(_, bb) {
    var Repository = function(options){
        this.data = {};
    };

//    bb.Events,
    _.extend(Repository.prototype, {
        get: function(name, id){
            var region = this.data[name];
            var model = region ? region[id] : null;
            return model;
        },
        put: function(name, id, model){
            var region = this.data[name];
            if(!region){
                this.data[name] = region = {};
            }

            var replaced =  region[id] ? true : false;
            region[id] = model;
            return replaced;
        }
    });

    Repository.defaults = {
    };

    return Repository;
});