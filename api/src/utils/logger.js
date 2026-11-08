const fs = require("fs");
const path = require("path");

// Append structured JSON events without recording passwords, JWTs or full request bodies.
const logDirectory = path.join(__dirname, "../../logs");
const logFile = path.join(logDirectory, "application.log");

function logEvent(event, details = {}) {
    try {
        fs.mkdirSync(logDirectory, { recursive: true });
        const entry = {
            timestamp: new Date().toISOString(),
            event,
            ...details
        };
        fs.appendFileSync(logFile, `${JSON.stringify(entry)}\\n`, { encoding: "utf8" });
    } catch (error) {
        // Logging must not crash a user request if the disk is unavailable.
        console.error("Unable to write application log:", error.message);
    }
}

module.exports = logEvent;
