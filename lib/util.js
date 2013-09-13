module.exports = {
    extend: function(obj, source) {
        for (var prop in source) {
            obj[prop] = source[prop];
        }
        return obj;
    },
    clone: function(source) {
        return _extend({},source);
    },
    defaults: function(obj, source) {
        for (var prop in source) {
            if (obj[prop] == null) obj[prop] = source[prop];
        }
        return obj;
    }
};