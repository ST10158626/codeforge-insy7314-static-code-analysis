const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");

const connectDatabase = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const gigRoutes = require("./routes/gigRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const errorHandler = require("./middleware/errorHandler");
const securityHeaders = require("./middleware/securityHeaders");
const inputSanitization = require("./middleware/inputSanitization");

const app = express();
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));
app.use(inputSanitization);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "HustleHub+ API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "NotFound", message: "The requested endpoint does not exist." });
});
app.use(errorHandler);

async function startServer() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing from api/.env");
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing from api/.env");
  await connectDatabase();
  const keyPath = path.join(__dirname, "../certs/localhost-key.pem");
  const certPath = path.join(__dirname, "../certs/localhost.pem");
  const httpsOptions = { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
  const port = Number(process.env.PORT || 3444);
  https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`HustleHub+ API running at https://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Unable to start HustleHub API:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
