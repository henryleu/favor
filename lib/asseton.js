function hander(mode, mainCss, mainJs, configJs) {
    return function (req, res, next) {
        req.asset = {
            mode: mode,
            mainCss: mainCss,
            mainJs: mainJs,
            configJs: configJs
        };
        next();
    };
}
module.exports = {
    development: function () {
        return hander(
            'development',
            './public/build/main.css',
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