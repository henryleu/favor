define(['skeleton', 'config', './Thing', './ThingsPuller'],
function(sk, config, Thing, ThingsPuller) {

    var RequestObject = function(params){
        this.params = params;
    };
    RequestObject.prototype.setCollection = function(col){
        this.collection = col;
    };
    RequestObject.prototype.generateDigest = function(){
        this.digest = JSON.stringify(this.params);
    };
    RequestObject.prototype.save = function(){
        this.collection.lastRequestObject = this;
    };
    RequestObject.prototype.equalsLast = function(){
        return this.collection.lastRequestObject && this.collection.lastRequestObject.digest == this.digest ? true : false;
    };

    var ThingsCollected = sk.Collection.extend({
        model: Thing,
        name: 'ThingsCollected',
        url: '/things/auto',
        configure: function(){
            this.puller = new ThingsPuller();
            this.defaultStream = config.collection.defaultStream;
            this.initialPageSize = config.collection.initialPageSize;
            this.appendedPageSize = config.collection.appendedPageSize;
        },
        getParams: function(tags, stream, pageStart, pageSize){
            var params = {};
            params.tags = tags;
            params.stream = stream || this.defaultStream;
            params.pageStart = pageStart || 0;
            params.pageSize = pageSize;

            return params;
        },
        makeRequestObject: function(tags, stream, pageStart, pageSize){
            var params = this.getParams(tags, stream, pageStart, pageSize);
            var ro = new RequestObject(params);
            ro.setCollection(this);
            ro.generateDigest();
            return ro;
        },

        pull: function(requestObject){
            this.touchEnd = false;
            this.running = true;
console.log('pull requesting' );

            var me = this;
            var puller = this.puller;
            puller.collect(requestObject.params, function(success){
                if(!success){
                    me.running = false;
                    //TODO: notification error
                    return;
                }
                requestObject.save();
                me.touchEnd = puller.models.length < requestObject.params.pageSize;
                me.trigger('touch-end', me.touchEnd);
                me.reset([]);
                me.add(puller.models);
                me.pulled = true;
                me.trigger('pull', me, puller.models);
                me.running = false;
            });
        },
        append: function(requestObject){
            this.touchEnd = false;
            this.running = true;
console.log('append requesting' );
            var me = this;
            var puller = this.puller;
            puller.collect(requestObject.params, function(success){
                if(!success){
                    me.running = false;
                    //TODO: notification error
                    return;
                }
                requestObject.save();
                me.touchEnd = puller.models.length < requestObject.params.pageSize;
                me.trigger('touch-end', me.touchEnd);
                me.add(puller.models);
                me.appended = true;
                me.trigger('append', me, puller.models);
                me.running = false;
            });
        },
        find: function(tags, stream, pageStart){
            if(this.running){
                return;
            }
            var requestObject = this.makeRequestObject(tags, stream, pageStart, this.initialPageSize);
            if(requestObject.equalsLast()){
                console.info('Duplicated request comparing to last: ' + requestObject.digest);
                return ;
            }
            this.pull(requestObject);
        },
        refresh: function(){
            if(this.running){
                return;
            }
            if(this.lastRequestObject){
                var params = this.lastRequestObject.params;
                var requestObject = this.makeRequestObject(params.tags, params.stream, 0, this.initialPageSize);
                console.log(requestObject);
                this.pull(requestObject);
            }
        },
        findMore: function(){
            if(this.running){
                return;
            }
            if(this.touchEnd){
                return;
            }
            var params = this.lastRequestObject.params;
            var tags = params.tags;
            var stream = params.stream;
            var pageStart = params.pageStart + params.pageSize;
            var pageSize = this.appendedPageSize;
            var requestObject = this.makeRequestObject(tags, stream, pageStart, pageSize);
            if(requestObject.equalsLast()){
                console.info('Duplicated request comparing to last: ' + requestObject.digest);
                return ;
            }
            this.append(requestObject);
        },
        noMore: function(){
            return this.touchEnd;
        }
    });
    return ThingsCollected;
});