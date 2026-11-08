const logEvent = require("../utils/logger");

// Record request outcome and response status without logging credentials or request bodies.
module.exports = function requestLogger(req, res, next) {
    const startedAt = Date.now();
    res.on("finish", () => {
        logEvent("http_request", {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - startedAt,
            ip: req.ip
        });
    });
    next();
};
