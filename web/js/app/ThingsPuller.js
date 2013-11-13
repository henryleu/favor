define(['jQuery', 'skeleton','./Thing'], function($, sk, Thing) {
    var ThingsPuller = sk.Collection.extend({
        model: Thing,
        name: 'ThingsPuller',
        url: '/things-list',
        pullList: function(idList, callback){
            var options = {
                data: {
                    ids: idList.join('-')
                },
                url:  '/things-list',
                success: function(){
                    alert('success');
                    if(callback){
                        callback(true);
                    }
                },
                error: function(){
                    alert('error');
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