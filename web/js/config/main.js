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
        collection: {
            defaultStream: 'auto',
            initialPageSize: 10,
            appendedPageSize: 10,
            shortCardHeightValve: 200 //if lane's height diff is greater than it, needs extra compensation
        },
        analytics: {
            trackerName: 'favor###',
            options: {
                'cookieDomain': 'none' // 'foo.example.com'
//                , 'cookieName': 'myNewName'
//                , 'cookieExpires': 20000
            }
        },
        upai: {
            url: "http://v0.api.upyun.com/",
            bucket: "favor-image",
            formApiSecret: "hlt6AYN9jPpFdU2mAZ2RY+R8wQE=",
            returnUri: "/upaireturn"
        }
    };

//    require.config({config: config});
    window.appConfig = window.appConfig || {};
    _apply(window.appConfig, config);
    return config;
});