const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const errorMiddleWare = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");
const roleRoutes = require("./routes/role.routes");
const permissionRoutes = require("./routes/permission.routes");
const departmentRoute = require("./routes/department.route");
const designationRoute = require("./routes/designation.routes");
const dashboardRoute = require("./routes/dashboard.routes");
const attendanceRoute = require("./routes/attendance.routes");

const app = express();

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/permission", permissionRoutes);
app.use("/api/departments", departmentRoute);
app.use("/api/designations", designationRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/attendance", attendanceRoute);



app.use(errorMiddleWare);

module.exports = app