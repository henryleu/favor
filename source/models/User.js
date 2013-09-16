var mongoose = require('../commons/mongoose');
var DomainBuilder = require('./common/DomainBuilder');
var UserState = require('./common/enums').UserState;

var schema = DomainBuilder
    .i('User')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        utoken: {type: String}
        , stt: {type: String, enum: UserState.values(), required: true}
        , username: {type: String, default: '匿名'}
        , email: {type: String}
    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model(schema.name, schema);