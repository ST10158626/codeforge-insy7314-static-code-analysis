// Basic request sanitisation. Validation remains necessary in each route/controller.
// This middleware rejects MongoDB-style operator keys and trims strings to reduce unsafe input.
function sanitizeValue(value, depth = 0) {
    if (depth > 20) {
        throw new Error("Request data is nested too deeply.");
    }

    if (typeof value === "string") {
        return value.replace(/\0/g, "").trim();
    }

    if (Array.isArray(value)) {
        return value.map((item) => sanitizeValue(item, depth + 1));
    }

    if (value && typeof value === "object") {
        const cleaned = {};
        for (const [key, item] of Object.entries(value)) {
            if (key.startsWith("$") || key.includes(".")) {
                throw new Error("Request contains an invalid property name.");
            }
            cleaned[key] = sanitizeValue(item, depth + 1);
        }
        return cleaned;
    }

    return value;
}

function inputSanitization(req, res, next) {
    try {
        if (req.body && typeof req.body === "object") {
            req.body = sanitizeValue(req.body);
        }
        if (req.query && typeof req.query === "object") {
            // Do not replace Express's getter-only req.query. Validate it and reject unsafe keys.
            sanitizeValue(req.query);
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: "InvalidInput",
            message: error.message || "Request contains invalid input."
        });
    }
}

module.exports = inputSanitization;

/*
 * References
 * OWASP Foundation, 2025. Input Validation Cheat Sheet. [online] Available at:
 * https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
 * [Accessed 10 October 2026].
 */
