function hander(mode, mainCss, mainJs, configJs) {
    return function (req, res) {
        res.locals.asset = {
            mode: mode,
            mainCss: mainCss,
            mainJs: mainJs,
            configJs: configJs
        };
    };
}
var asseton = {
    development: function () {
        return hander(
            'development',
            './web/build/main.css',
            './public/components/requirejs/require.js',
            './web/js/main.js');
    },

    production: function () {
        return hander(
            'production',
            './public/build/main.css',
            './public/build/main.js',
            '');
    }
};

module.exports = function(mode){
    return asseton[mode]();
};