var mongoose = require('../commons/mongoose');
var DomainBuilder = require('./common/DomainBuilder');
var Comment = require('./Comment').schema;
var schema = DomainBuilder
    .i('Thing')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withCreatedBy()
    .withUpdatedOn()
    .withUpdatedBy()
    .withRank()
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
        , "meta": {
            "views":  {type: Number, default: 0} //value of how many times user view it
            , "likes":  {type: Number, default: 0} //value of how many users like it
            , "owns":   {type: Number, default: 0} //value of how many users have owned it now matter where they bought from
            , "deals":  {type: Number, default: 0} //value of how many deals users have bought it from this site
        }
        , "comments": [Comment]
    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model(schema.name, schema);