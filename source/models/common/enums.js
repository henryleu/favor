var EnumType = require('./EnumType');

var LifeFlag = new EnumType([
    {
        value: 'a',
        name: 'Active',
        text: '已激活'
    },
    {
        value: 'i',
        name: 'Inactive',
        text: '已锁定'
    },
    {
        value: 'd',
        name: 'Deleted',
        text: '已删除'
    }
]);

module.exports = {
    LifeFlag: LifeFlag
};