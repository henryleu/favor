var SchemaPlugin = require('./SchemaPlugin');

var plugin = new SchemaPlugin({
    name: 'createdBy',
    prop: 'crtBy',
    type: {type: String, ref: 'User', default: null},
    use: function(schema, options){
        //Add the property to schema
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);

        //Add a save method's Preprocessor for createdBy auto-populating with current user
        schema.pre('save', function (next) {
            //TODO: get and set current user id
            next()
        });
    }
});

module.exports = plugin;