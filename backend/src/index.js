const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const prisma = require("./lib/prisma");
const authController = require("./controllers/authController");
const empController = require("./controllers/employeeController");
const attController = require("./controllers/attendanceController");
const leaveController = require("./controllers/leaveController");
const { authenticate, authorize } = require("./middlewares/auth");
const { calculatePayroll2024 } = require("./utils/payrollEngine");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);
app.post("/api/attendance/clock-in", authenticate, attController.clockIn);
app.post("/api/leave/request", authenticate, leaveController.requestLeave);
app.get("/api/employees", authenticate, authorize(["ADMIN"]), empController.getAllEmployees);
app.post("/api/employees", authenticate, authorize(["ADMIN"]), empController.createEmployee);
app.put("/api/leave/:id", authenticate, authorize(["ADMIN"]), leaveController.updateLeaveStatus);
app.get("/api/payroll/:employeeId", authenticate, authorize(["ADMIN"]), async (req, res) => {
    try {
        const emp = await prisma.employee.findUnique({ where: { id: req.params.employeeId } });
        const payroll = calculatePayroll2024(emp.baseSalary, emp.allowances, emp.taxCategory);
        res.json(payroll);
    } catch (e) { res.status(500).json({ error: "Payroll failed" }); }
});

module.exports = app;