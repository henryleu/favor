var mongoose = require('../commons/mongoose');
var DomainBuilder = require('./common/DomainBuilder');
var schema = DomainBuilder
    .i('Thing')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withProperties({
        name: {type: String, required: true}
    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model(schema.name, schema);