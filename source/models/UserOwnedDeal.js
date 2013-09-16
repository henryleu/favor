var mongoose = require('../commons/mongoose');
var SchemaBuilder = require('./common/Common').SchemaBuilder;
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