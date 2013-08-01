var mongoose = require('../../lib/mongoose').mongoose;

var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var DealSchema = new Schema({
    "id":         Number

    , "mv":     Number //document model version: the structure's version
    , "dv":     Number //document version: the record's version

    //main image url
    , "image": String //"http://making-photos.b0.upaiyun.com/photos/2a7343fa66062c66c31586473124f009.jpg!normal",

    //other image urls
    , "images": [String]

    //the original url of the deal
    , "dUrl": String //"http://making-photos.b0.upaiyun.com/photos/2a7343fa66062c66c31586473124f009.jpg!normal"

    //the original website of the deal: it is id of site which is maintain in other collections
    , "dSite": String

    //short description as a title for marketing
    , "sDesc": String//"Jawbone UP 2nd Generation - 你的生活小秘书"

    //brief summary as a product name for product naming
    , "pSum": String //"Jawbone UP 2nd Generation"

    //long description as detailed product information
    , "lDesc": String //"Jawbone UP 2nd Generation - 你的生活小秘书, Jawbone UP 2nd Generation - 你的生活小秘书"

    //highly-frequently changed information which will be maintained in redis
    ///////////////////////////
    , "views":  Number //"101"
    , "likes":  Number //"96"
    , "owns":   Number //"96"
    , "deals":  Number //"2"
    ///////////////////////////

    , createdBy:    { type: Number, ref: 'User' }
    , createdOn:    Date
    //, comments:     [Comments]

});

var Deal = mongoose.model('Deal', DealSchema);

module.exports.Deal = Deal;