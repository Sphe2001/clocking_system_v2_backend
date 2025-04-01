const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/dbConfig.js");

const Admin = sequelize.define("Admin", {
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
    default: "admin",
  },
  surname: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  initials: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    default: true,
  },
  isPasswordResetVerified: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
});

module.exports = Admin;
