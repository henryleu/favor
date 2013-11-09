var SchemaPlugin = require('./SchemaPlugin');

var plugin = new SchemaPlugin({
    name: 'createdOn',
    prop: 'crtOn',
    type: {
        type: Date
    },
    use: function(schema, options){
        //Add the property to schema
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);

        //Add a save method's Preprocessor for updatedOn auto-generating
        schema.pre('save', function (next) {
            this.autoCreatedOn();
            next();
        });

        //Add a instance method to ensure updatedOn: generate, set and return it
        var prop = this.prop;
        schema.method('autoCreatedOn', function (time) {
            if(time){
                this[prop] = time;//TODO: use module to generate time
            }
            else if(!this[prop]){
                this[prop] = new Date();//TODO: use module to generate time
            }
            return this[prop];
        });
    }
});

module.exports = plugin;