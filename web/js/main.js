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
        },
        'Util': {
            deps: ['jQuery']
        }
    },
    paths: {
        requireLib : '../../public/components/requirejs/require',
//        'google-analytics' : ["http://www.google-analytics.com/analytics",
//            "../../public/components/bower-google-analytics/analytics"],
        'google-analytics' : "../../public/components/bower-google-analytics/analytics",
        jQuery: '../../public/components/jquery/jquery',
        Underscore: '../../public/components/underscore/underscore',
        Backbone: '../../public/components/backbone/backbone',
        Bootstrap: '../../public/components/bootstrap-tl/tl/js/bootstrap',
        'jquery.ui.widget':  '../../public/components/jquery-file-upload/js/vendor/jquery.ui.widget',
        Fileupload: '../../public/components/jquery-file-upload/js/jquery.fileupload',
        JST: '../../public/build/js/templates',
        Spa: 'backbone-spa',
        Analytics: 'analytics',
        Flowbar: 'flowbar',
        Favor: 'favor',
        Util: 'util',
        App: 'app'
    },
    deps: ['App', 'Util'],
    callback: function(){
    },
    preserveLicenseComments: false
});