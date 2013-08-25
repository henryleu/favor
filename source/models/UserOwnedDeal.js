var mongoose = require('../../lib/mongoose');
var SchemaBuilder = require('./Common').SchemaBuilder;
var schema = SchemaBuilder
    .i()
    .withBase()
    .withCreatedOn()
    .withProperties({
        uid: String
        , dealId: String
    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model('UserOwnedDeal', schema);