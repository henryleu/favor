var mongoose = require('../../lib/mongoose');
var BaseSchema = require('./Common').BS;

var schema = new BaseSchema({
    username: {type: String, default: 'nousername'}
    , email: String
    , uid: String
});

var Model = mongoose.model('User', schema);

module.exports = Model;