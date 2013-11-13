define(['Underscore', 'Backbone'],
function(_, bb) {
    var Repository = function(options){
        var mediator = options.mediator;
        if(mediator){
            this.listenTo(mediator, 'read', this._onRead, this);
            this.listenTo(mediator, 'delete', this._onDelete, this);
        }
        this.data = {};
    };

    _.extend(Repository.prototype, bb.Events, {
        _onRead: function(model, resp, options){
            if(model.length){
                var len = model.length;
                var col = model;
                var Model = col.model;
                var toReplace = {};
                for(var i=0; i<len; i++){
                    var m = col.at(i);
                    if(m){
                        var cacheModel = this.get(Model.name, m.id);
                        if(cacheModel){
                            cacheModel.set(m.attributes);
                            toReplace[i] = cacheModel;
                            console.log(cacheModel);
                        }
                        else{
                            this.put(Model.name, m.id, m);
                        }
                    }
                }

                //Replace the existed items in the just fetched collection
                console.log('toReplace');
                console.log(toReplace);
                for(var i in toReplace){
                    var item = toReplace[i];
                    col.replace(i, toReplace[i]);
                }
            }
            else{
                this.put(model.name, model.id, model);
            }
        },
        _onDelete: function(model, resp, options){
            this.remove(model.name, model.id);
        },
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
            console.log(name + ' ' + id + ' is put');
            return replaced;
        },
        remove: function(name, id){
            var model = this.get(name, id);
            if(model){
                this.data[name][id] = null;
                console.log(name + ' ' + id + ' is removed');
                return true;
            }
            else{
                return false;
            }
        }
    });

    Repository.defaults = {
    };

    return Repository;
});