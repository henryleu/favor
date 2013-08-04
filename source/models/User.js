var mongoose = require('../../lib/mongoose');
var SchemaBuilder = require('./Common').SchemaBuilder;
var schema = SchemaBuilder
    .i()
    .withBase()
    .withCreateOn()
    .withProperties({
        username: {type: String, default: 'nousername'}
        , email: String
        , uid: String
    })
    .build();

var Model = mongoose.model('User', schema);

module.exports = Model;