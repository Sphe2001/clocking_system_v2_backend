const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/dbConfig");

const StudentAttendance = sequelize.define(
  "StudentAttendance",
  {
    attendance_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clock_in: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    clock_out: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    hours_worked: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = StudentAttendance;
