
exports.up = function(next){
    console.info("set up and configure redis...");
    next();
};

exports.down = function(next){
    console.info("tear down redis...");
    next();
};
