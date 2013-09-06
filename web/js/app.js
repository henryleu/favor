define( ['Bootstrap', 'Fileupload', 'Favor', 'Flowbar'], function (Bootstrap, Fileupload, App, Flowbar) {
    var app = new App({});
    app.startup();
    var flowbar = new Flowbar({});
    flowbar.start();
});