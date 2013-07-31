
exports.up = function (next) {
    console.info("set up and configure mysql...");
    next();
};

exports.down = function (next) {
    console.info("tear down mysql...");
    next();
};
