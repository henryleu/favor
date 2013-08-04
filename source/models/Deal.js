var mongoose = require('../../lib/mongoose');
var SchemaBuilder = require('./Common').SchemaBuilder;
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var schema = SchemaBuilder
    .i()
    .withBase()
    .withCreatedBy()
    .withCreateOn()
    .withProperties({
        //main image url
        "image": String //"http://making-photos.b0.upaiyun.com/photos/2a7343fa66062c66c31586473124f009.jpg!normal",

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

        //the highly-frequently changed information which will be maintained in redis later
        ///////////////////////////
        , "views":  {type: Number, default: 0} //"101"
        , "likes":  {type: Number, default: 0} //"96"
        , "owns":   {type: Number, default: 0} //"96"
        , "deals":  {type: Number, default: 0} //"2"
        ///////////////////////////
    })
    .build();

var Model = mongoose.model('Deal', schema);

module.exports = Model;