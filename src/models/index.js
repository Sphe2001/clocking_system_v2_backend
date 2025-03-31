const sequelize = require("../helpers/dbConfig");
const Admin = require("./adminModel");
const Student = require("./studentModel");
const Supervisor = require("./supervisorModel");
const StudentAttendance = require("./studentAttendance");
const SupervisorAttendance = require("./supervisorAttendance");
const UserOTPVerification = require("./userOTPVerification");

// Relationships
//Attendance
Student.hasMany(StudentAttendance, { foreignKey: "studentNo" });
StudentAttendance.belongsTo(Student, { foreignKey: "studentNo" });

Supervisor.hasMany(SupervisorAttendance, { foreignKey: "staffNo" });
SupervisorAttendance.belongsTo(Supervisor, { foreignKey: "staffNo" });

module.exports = {
  sequelize,
  Admin,
  Student,
  Supervisor,
  StudentAttendance,
  SupervisorAttendance,
  UserOTPVerification,
};
