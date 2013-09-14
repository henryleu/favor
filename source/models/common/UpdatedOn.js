var SchemaPlugin = require('./SchemaPlugin');

var plugin = new SchemaPlugin({
    name: 'updatedOn',
    prop: 'updOn',
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
            this.autoUpdatedOn();
            next()
        });

        //Add a instance method to ensure id: generate, set and return id
        var prop = this.prop;
        schema.method('autoUpdatedOn', function () {
            this[prop] = new Date();//TODO: use module to generate time
            return this[prop];
        })
    }
});

module.exports = plugin;