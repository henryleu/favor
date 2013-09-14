var SchemaPlugin = require('./SchemaPlugin');
var idGen = require('../../../lib/id');
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

        //Add a save method's Preprocessor for id auto-generating
        schema.pre('save', function (next) {
            this.autoCreatedOn();
            next()
        });

        //Add a instance method to ensure id: generate, set and return id
        var prop = this.prop;
        schema.method('autoCreatedOn', function () {
            if(!this[prop]){
                this[prop] = new Date();//TODO: use module to generate time
            }
            return this[prop];
        })
    }
});

module.exports = plugin;