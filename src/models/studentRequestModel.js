const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/dbConfig");
const Student = require("./studentModel");

const studentRequest = sequelize.define("studentRequestModel", {
    studentNo: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    reason: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    // forgotPasswordToken:{
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // forgotPasswordTokenExpiry:{
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // verifyToken:{
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // verifyTokenExpiry:{
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
  });

  module.exports = studentRequest;