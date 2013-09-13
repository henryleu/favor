var mongoose = require('../../lib/mongoose');
var SchemaBuilder = require('./common/Common').SchemaBuilder;
var schema = SchemaBuilder
    .i()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withProperties({
        content: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model('Comment', schema); //basically, do not use it because it is sub schema