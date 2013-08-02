var mongoose = require('../../lib/mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    username: String
    , email: String
    , uid: String
});

var Model = mongoose.model('User', schema);

module.exports = Model;