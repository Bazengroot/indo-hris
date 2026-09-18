const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const prisma = require("./lib/prisma");
const { authenticate, authorize } = require("./middlewares/auth");
const { calculatePayroll2024 } = require("./utils/payrollEngine");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "OK" }));

module.exports = app;