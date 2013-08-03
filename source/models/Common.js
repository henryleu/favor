var _ = require('underscore');
var mongoose = require('mongoose');
var logger = require('../../lib/logging').logger;
var CommonProps = {
    ID: '_id',
    MODEL_VERSION: '_mv',
    DOCUMENT_VERSION: '_dv',
    LIFE_FLAG: 'lFlg',
    CREATED_BY: 'crtBy',
    CREATED_ON: 'crtOn',
    UPDATED_BY: 'updBy',
    UPDATED_ON: 'updOn'
};
var CP = CommonProps;

var CommonSchema = {};
CommonSchema[CommonProps.ID] = Number;
CommonSchema[CommonProps.MODEL_VERSION] = {type: Number, default: 0};
CommonSchema[CommonProps.DOCUMENT_VERSION] = {type: Number, default: 0};
CommonSchema[CommonProps.LIFE_FLAG] = {type: Number, default: 0};
CommonSchema[CommonProps.CREATED_BY] = {type: Number, ref: 'User'};
CommonSchema[CommonProps.CREATED_ON] = {type: Date, default: null};
CommonSchema[CommonProps.UPDATED_BY] = {type: Number, ref: 'User'};
CommonSchema[CommonProps.UPDATED_ON] = {type: Date, default: null};
var CS = CommonSchema;

var BaseOptions = {
    strict: true,
    versionKey: CommonProps.DOCUMENT_VERSION
};
var Schema = mongoose.Schema;

var BaseSchema = function(definition){
    var baseSchema = _.pick(CS, CP.ID, CP.MODEL_VERSION, CP.DOCUMENT_VERSION);
    _.extend(baseSchema, definition);
    _.extend(arguments[0], baseSchema);
    logger.info(JSON.stringify(baseSchema));
    Schema.apply(this, arguments);
};
BaseSchema.prototype.create = function(){
    var baseSchema = _.pick(CS, CP.ID, CP.MODEL_VERSION, CP.DOCUMENT_VERSION);
    switch (arguments.length) {
        case 1:
            return Schema.create.call(this, baseSchema, arguments[0]);
        case 2:
            _.extend(baseSchema, arguments[0]);
            return Schema.create.call(this, baseSchema, arguments[1]);
        default:
            throw new YAMLException('Wrong number of arguments for Schema.create function');
    }
    return schema;
};

module.exports = {
    CP: CP,
    CS: CS,
    BO: BaseOptions,
    BS: BaseSchema
};