var mongoose = require('../commons/mongoose');
var DomainBuilder = require('./common/DomainBuilder');
var schema = DomainBuilder
    .i('Comment')
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withProperties({
        content: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model(schema.name, schema); //basically, do not use it because it is sub schema