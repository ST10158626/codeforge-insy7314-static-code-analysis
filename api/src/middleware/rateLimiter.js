const rateLimit = require("express-rate-limit");

// Restrict repeated login/registration attempts. The limit is per IP address by default.
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: "TooManyRequests",
        message: "Too many authentication attempts. Please try again in 15 minutes."
    }
});

// Limit booking creation to reduce accidental or automated repeated requests.
const bookingRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: "TooManyRequests",
        message: "Too many booking requests. Please wait before trying again."
    }
});

module.exports = { authRateLimiter, bookingRateLimiter };

/*
 * References
 * Express Rate Limit, 2026. express-rate-limit. [online] Available at:
 * https://express-rate-limit.mintlify.app/overview
 * [Accessed 10 October 2026].
 */
