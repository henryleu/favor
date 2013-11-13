define(['jQuery', 'skeleton','./Thing', './ThingsPuller', './Repository', './UserHolder'],
    function($, sk, Thing, ThingsPuller, Repository, UserHolder) {
    var ThingsCreated = sk.Collection.extend({
        model: Thing,
        name: 'ThingsCreated',
//        url: '/things-auto',
        configure: function(){
            this.puller = new ThingsPuller();
        },
        pull: function(options){
            var me = this;
            var my =  UserHolder.get();
            var creates = my.get('meta').creates;
            var toAdd = [];
            var toLoad = [];
            for(var id in creates){
                if(!creates[id]){
                    continue;
                }

                var m = Repository.get(this.model.name, id);
                if(m){
                    toAdd.push(m);
                }
                else{
                    toLoad.push(id);
                }
            }

console.log(toAdd.length + ' things have pulled and existed in repo');
console.log(toAdd);
            if(toLoad.length>0){
console.log(toLoad.length + ' things need to be pulled');
console.log(toLoad);
                var puller = this.puller;
                puller.pullList(toLoad, function(){
                    if(toAdd.length>0){
                        me.add(toAdd);
                    }
                    me.add(puller.models);
                    me.pulled = true;
                    me.trigger('pull', me);
                });
            }
            else{
                if(toAdd.length>0){
                    me.add(toAdd);
                }
                me.pulled = true;
                me.trigger('pull', me);
            }
        }
    });

    return ThingsCreated;
});