const express = require("express");
const bcrypt = require("bcryptjs");
const { Admin, Student, Supervisor } = require("../../models");
const sendResetPasswordOTP = require("../../helpers/sendPasswordResetOTP");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv")

const router = express.Router();
router.use(cookieParser());
dotenv.config();

router.post("/request/passwordreset", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "FAILED",
        message: "Please provide details",
      });
    }

    let user = await Student.findOne({ where: { studentNo: email } });
    if (!user) user = await Supervisor.findOne({ where: { staffNo: email } });
    if (!user) user = await Admin.findOne({ where: { staffNo: email } });

    if (!user) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "User does not exist" });
    }

    // send OTP
    sendResetPasswordOTP(email);

    const tokenData = {
              email: email,
            };
        
            const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
              expiresIn: "1h",
            });
        
            res.cookie("passwordresettoken", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "Strict",
              maxAge:  60 * 60 * 1000 ,
            });

    res.status(200).json({
      status: "SUCCESS",
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
    });
  }
});

module.exports = router;
