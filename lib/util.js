module.exports = {
    test: function () {
    },

    apply: function (t, s) {
        for (var k in s) {
            if(!t[k]){
                t[k] = s[k];
            }
        }
    }
};