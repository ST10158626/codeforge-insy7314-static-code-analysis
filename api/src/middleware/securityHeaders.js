// Security response headers for the HustleHub API.
// In production, review the Content Security Policy against the deployed frontend and API domains.
function securityHeaders(req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    res.setHeader("Content-Security-Policy", "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; object-src 'none'");

    // HSTS is only appropriate when the API is accessed over HTTPS.
    if (req.secure) {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }

    next();
}

module.exports = securityHeaders;

/*
 * References
 * OWASP Foundation, 2025. HTTP Headers Cheat Sheet. [online] Available at:
 * https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
 * [Accessed 10 October 2026].
 */
