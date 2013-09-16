var mongoose = require('../commons/mongoose');
var DomainBuilder = require('./common/DomainBuilder');
var schema = DomainBuilder
    .i('UserOwnedDeal')
    .withBasis()
    .withCreatedOn()
    .withProperties({
        uid: String
        , dealId: String
    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model(schema.name, schema);