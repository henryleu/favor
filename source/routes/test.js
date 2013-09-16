var logger = require('../commons/logging').logger;
var idGenerator = require('../commons/id');

module.exports = function(app) {
    app.get('/test', function(req, res) {
        throw new Error('test error handling');
    });
    app.get('/snippet', function(req, res) {
        req.session.lastAccessTime = new Date();
        res.render('snippet', {});
    });

    app.get('/next-ids', function(req, res) {
        var size = req.query.size;
        var ids = [];
        var num = Number(size||10);
        var id = null;
        for(var i=0; i<num; i++){
            id = idGenerator.next().toId();
            ids.push(id);
            logger.debug('id: ' + id);
        }
        res.json(200, ids);
    });
};