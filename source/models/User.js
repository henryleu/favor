var mongoose = require('../../lib/mongoose');
var SchemaBuilder = require('./Common').SchemaBuilder;
var schema = SchemaBuilder
    .i()
    .withBase()
    .withCreatedOn()
    .withProperties({
        utoken: {type: String}
        , uid: {type: String}
        , state: {type: Boolean}
        , username: {type: String, default: 'nousername'}
        , email: String
    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model('User', schema);