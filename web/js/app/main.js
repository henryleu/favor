define(['./Favor', 'JST', 'config'],
function(Favor, JST, config) {
    var appConfig = window.appConfig;

    var App = new Favor({
        mode: appConfig.mode,
        JST: JST
    });
    return App;
});