var mongoose = require('../../lib/mongoose');
var SchemaBuilder = require('./Common').SchemaBuilder;
var schema = SchemaBuilder
    .i()
    .withBase()
    .withCreatedOn()
    .withProperties({
        username: {type: String, default: 'nousername'}
        , email: String
        , uid: String
    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model('User', schema);