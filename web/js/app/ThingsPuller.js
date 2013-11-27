define(['jQuery', 'skeleton','./Thing'], function($, sk, Thing) {
    var ThingsPuller = sk.Collection.extend({
        model: Thing,
        name: 'ThingsPuller',
        collect: function(queryObject, callback){
            var options = {
                data: queryObject,
                url:  '/things/collect',
                reset: true,
                success: function(){
                    if(callback){
                        callback(true);
                    }
                },
                error: function(){
                    if(callback){
                        callback(false);
                    }
                }
            };
            this.fetch(options)
        },
        list: function(idList, callback){
            var options = {
                data: {
                    ids: idList.join('-')
                },
                url:  '/things/list',
                reset: true,
                success: function(){
                    if(callback){
                        callback(true);
                    }
                },
                error: function(){
                    if(callback){
                        callback(false);
                    }
                }
            };
            this.fetch(options)
        }
    });

    return ThingsPuller;
});