/*
 * HustleHub - Global Error Handler
 *
 * This middleware provides a consistent error response
 * when an unexpected error occurs in the API.
 *
 * It also prevents technical error information from
 * being exposed directly to users.
 */


const logEvent = require("../utils/logger");

function errorHandler(err, req, res, next) {

    // Log the complete error for the developer (technical details are not returned to the client)
    console.error("HustleHub API Error:", err);
    logEvent("api_error", {
        method: req.method,
        path: req.originalUrl,
        statusCode: err.statusCode || 500,
        errorName: err.name || "Error",
        message: err.message,
        userId: req.user?.userId || null,
        ip: req.ip
    });

     // Use the status code supplied by the error when available
     // If no status code exists, HTTP 500 is used to represent an unexpected internal server error
    const statusCode = err.statusCode || 500;


    //Send a safe and consistent error response to the client
    return res.status(statusCode).json({
        success: false,
        error: err.name || "InternalServerError",
        message:
            statusCode === 500
                ? "An unexpected server error occurred."
                : err.message
    });
}


// Export the global error handler so it can be registered by server.js
module.exports = errorHandler;


/*
 * =======================================================================================================
 * REFERENCES
 * =======================================================================================================
 *
 * Express.js, 2026. Error handling.
 * [online] Available at:
 * https://expressjs.com/en/5x/guide/error-handling/
 *
 * Express.js, 2026. Writing middleware for use in Express apps.
 * [online] Available at:
 * https://expressjs.com/en/guide/writing-middleware/
 *
 * [Accessed 1 September 2026].
 *
 * =======================================================================================================
 */