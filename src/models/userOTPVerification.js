const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/dbConfig.js");

const UserOTPVerification = sequelize.define("UserOTPVerification", {
  otpId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  otp: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  expiresAt: {
    type: DataTypes.DATE,
  },
});

module.exports = UserOTPVerification;
