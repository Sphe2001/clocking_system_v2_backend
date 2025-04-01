const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/dbConfig.js");

const PasswordResetOTP = sequelize.define("PasswordResetOTP", {
  otpId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
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

module.exports = PasswordResetOTP;
