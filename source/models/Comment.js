var mongoose = require('../../lib/mongoose');
var SchemaBuilder = require('./Common').SchemaBuilder;
var schema = SchemaBuilder
    .i()
    .withId()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withProperties({
        content: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model('Comment', schema);