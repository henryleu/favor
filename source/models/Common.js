var _ = require('underscore');
var mongoose = require('mongoose');
var logger = require('../../lib/logging').logger;
var Schema = mongoose.Schema;
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
var CS = CommonSchema;
CommonSchema[CommonProps.ID] = Number;
CommonSchema[CommonProps.MODEL_VERSION] = {type: Number, default: 0};
CommonSchema[CommonProps.DOCUMENT_VERSION] = {type: Number, default: 0};
CommonSchema[CommonProps.LIFE_FLAG] = {type: Number, default: 0};//INFO: 0: active; 1: inactive; 2: deleted;
CommonSchema[CommonProps.CREATED_BY] = {type: Number, ref: 'User', default: null};
CommonSchema[CommonProps.CREATED_ON] = {type: Date, default: null};
CommonSchema[CommonProps.UPDATED_BY] = {type: Number, ref: 'User', default: null};
CommonSchema[CommonProps.UPDATED_ON] = {type: Date, default: null};

var BaseOptions = {
    //safe: {}, //TODO: it is important option which need to be specified carefully later.
    strict: true,
    versionKey: CommonProps.DOCUMENT_VERSION
};

var SchemaBuilder = function(){
    this.properties = {}
    this.options = {};
};
SchemaBuilder.i = function(){
    return new SchemaBuilder();
};
SchemaBuilder.baseProperties = _.pick(CS, CP.ID, CP.DOCUMENT_VERSION);
SchemaBuilder.baseOptions = BaseOptions;
SchemaBuilder.prototype.withBase = function(){
    _.extend(this.properties, SchemaBuilder.baseProperties); //Append base properties' definition
    _.extend(this.options, SchemaBuilder.baseOptions); //Append base options' definition
    return this;
};
SchemaBuilder.prototype.withProperties = function(props){
    _.extend(this.properties, props);
    return this;
};
SchemaBuilder.prototype.withOptions = function(options){
    _.extend(this.options, options);
    return this;
};
SchemaBuilder.prototype.build = function(){
    return new Schema(this.properties, this.options);
};
SchemaBuilder.prototype.setStockProperty = function(propName){
    this.properties[propName] = CS[propName];
};
SchemaBuilder.prototype.withId = function(){ this.setStockProperty(CP.ID); return this;};
SchemaBuilder.prototype.withDocumentVersion = function(){ this.setStockProperty(CP.DOCUMENT_VERSION); return this;};
SchemaBuilder.prototype.withModelVersion = function(){ this.setStockProperty(CP.MODEL_VERSION); return this;};
SchemaBuilder.prototype.withLifeFlag = function(){ this.setStockProperty(CP.LIFE_FLAG); return this;};
SchemaBuilder.prototype.withCreatedBy = function(){this.setStockProperty(CP.CREATED_BY); return this;};
SchemaBuilder.prototype.withCreatedOn = function(){this.setStockProperty(CP.CREATED_ON); return this;};
SchemaBuilder.prototype.withUpdatedBy = function(){this.setStockProperty(CP.UPDATED_BY); return this;};
SchemaBuilder.prototype.withUpdatedOn = function(){this.setStockProperty(CP.UPDATED_ON); return this;};

module.exports = {
    SchemaBuilder: SchemaBuilder
};