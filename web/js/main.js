require.config({
    baseUrl: './web/js',
    shim: {
        'google-analytics':  {
            exports: "ga"
        },
        'jQuery': {
            exports: '$'
        },
        'Underscore': {
            exports: '_'
        },
        'Backbone': {
            deps: ['Underscore', 'jQuery'],
            exports: 'Backbone'
        },
        'Bootstrap': {
            deps: ['jQuery']
        },
        'jquery.ui.widget': {
            deps: ['jQuery']
        },
        'Fileupload': {
            deps: ['jQuery', 'jquery.ui.widget']
        },
        'JST': {
            exports: 'JST'
        }
//        'Util': {
//            deps: ['jQuery']
//        },
//        'UpaiUpload': {
//            deps: ['jQuery', 'Base64', 'Cryptojs/md5']
//        }
    },
    packages: ["skeleton", "misc", "config", "app"],
    paths: {
        requireLib : '../../public/components/requirejs/require',
        'google-analytics' : "../../public/components/bower-google-analytics/analytics",
        jQuery: '../../public/components/jquery/jquery',
        Underscore: '../../public/components/underscore/underscore',
        Backbone: '../../public/components/backbone/backbone',
        Bootstrap: '../../public/components/bootstrap-tl/tl/js/bootstrap',
        'jquery.ui.widget':  '../../public/components/jquery-file-upload/js/vendor/jquery.ui.widget',
        Fileupload: '../../public/components/jquery-file-upload/js/jquery.fileupload',
        Cryptojs: '../../public/components/tl-crypto-js/build/rollups',
        Base64: '../../public/components/js-base64/base64',
        JST: '../../public/build/js/templates',
        jQueryCustom: 'jquery.custom'
//        Spa: 'backbone-spa',
//        Flowbar: 'flowbar',
//        Favor: 'favor',
//        Util: 'util',
//        UpaiUpload: 'upai-upload'
//        App: 'app'
    },
//    deps: ['App', 'Util', 'UpaiUpload'],
    deps: ['app', 'misc'],
    callback: function(){
    },
    preserveLicenseComments: false
});