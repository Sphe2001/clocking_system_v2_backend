const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/dbConfig.js");

const Supervisor = sequelize.define("Supervisor", {
  staffNo: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    unique: true,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  role: {
    type: DataTypes.STRING,
    default: "supervisor",
  },
  surname: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  initials: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  contactNo: {
    type: DataTypes.STRING,
  },
  specialization: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  forgotPasswordToken:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  forgotPasswordTokenExpiry:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  verifyToken:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  verifyTokenExpiry:{
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Supervisor;
