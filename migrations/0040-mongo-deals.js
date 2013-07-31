
exports.up = function(next){
    console.info("initialize deals test data in mongodb...");
    next();
};

exports.down = function(next){
    console.info("un-initialize deals test data in mongodb...");
    next();
};
