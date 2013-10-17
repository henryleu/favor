define(['skeleton', './Thing'], function(sk, Thing) {
    var Showcase = sk.Model.extend({
        name: 'Showcase',
        configure: function(){
            this.thing = new Thing({});
        },
        setCurrentId: function(id){
            this.currentId = id;
            this.thing.set('_id', id);
        },
        getCurrent: function(){
            if(this.collection){
                var cur = this.collection.get(this.currentId);
                if(!cur) {
                    return this.thing;
                }
                else{
                    cur.fetched = true;
                    return cur;
                }
            }
            else{
                return this.thing;
            }
        },
        setCollection: function(col){
            this.collection = col;
        }
    });
    return Showcase;
});