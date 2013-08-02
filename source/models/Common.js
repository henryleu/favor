var _ = require('underscore');
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

var BaseSchemaProvider = function(){
    this.schema = null;
    this.schema = _.pick(CS, CP.ID, CP.MODEL_VERSION, CP.DOCUMENT_VERSION);
    logger.debug(JSON.stringify(this.schema));
};
BaseSchemaProvider.prototype.extend = function(){
    return this;
};
BaseSchemaProvider.prototype.toSchema = function(){
    return this.schema;
};

module.exports = {
    CP: CP,
    CS: CS,
    BO: BaseOptions,
    BS: new BaseSchemaProvider().toSchema()
};