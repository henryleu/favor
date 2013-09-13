var DomainBuilder = require('./SchemaBuilder');

DomainBuilder.plug(require('./Id'), true);
DomainBuilder.plug(require('./CreatedOn'));

module.exports = DomainBuilder;