define(['require'],
function(require) {
    var _apply = function(t, s){
        for(var p in s){
            if(!t[p]){
                t[p] = s[p];
            }
        }
    };

    var config = {
        mode: 'development', //by default, use development mode. it won't apply if mode is assigned
        Analytics: {
            trackerName: 'favor###',
            options: {
                'cookieDomain': 'none' // 'foo.example.com'
//                , 'cookieName': 'myNewName'
//                , 'cookieExpires': 20000
            }
        },
        Upai: {

        }
    };

//    require.config({config: config});
    window.appConfig = window.appConfig || {};
    _apply(window.appConfig, config);
    return config;
});