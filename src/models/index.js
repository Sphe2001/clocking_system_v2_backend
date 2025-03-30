const sequelize = require("../helpers/dbConfig");
const Admin = require("./adminModel");
const Student = require("./studentModel");
const Supervisor = require("./supervisorModel");
const Role = require("./roleModel");
const StudentAttendance = require("./studentAttendance");
const SupervisorAttendance = require("./supervisorAttendance");

// Define relationships
Role.hasMany(Admin, { foreignKey: "role_id" });
Admin.belongsTo(Role, { foreignKey: "role_id" });

Role.hasMany(Student, { foreignKey: "role_id" });
Student.belongsTo(Role, { foreignKey: "role_id" });

Role.hasMany(Supervisor, { foreignKey: "role_id" });
Supervisor.belongsTo(Role, { foreignKey: "role_id" });

Student.hasMany(StudentAttendance, { foreignKey: "studentNo" });
StudentAttendance.belongsTo(Student, { foreignKey: "studentNo" });

Supervisor.hasMany(SupervisorAttendance, { foreignKey: "supervisor_id" });
SupervisorAttendance.belongsTo(Supervisor, { foreignKey: "supervisor_id" });

module.exports = {
  sequelize,
  Admin,
  Student,
  Supervisor,
  Role,
  StudentAttendance,
  SupervisorAttendance,
};
