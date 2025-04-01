const express = require("express");
const bcrypt = require("bcryptjs");
const PasswordResetOTP = require("../../models/passwordResetOTP");
const { Student, Supervisor, Admin } = require("../../models");

const router = express.Router();

router.post("/verify/password/resetotp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: "FAILED",
        message: "Empty OTP details are not allowed",
      });
    }

    // Fetch OTP record
    const userOTPRecord = await PasswordResetOTP.findOne({ where: { email } });

    if (!userOTPRecord) {
      return res.status(400).json({
        status: "FAILED",
        message:
          "Password reset OTP is already verified or does not exist. Please send a new request.",
      });
    }

    const { expiresAt, otp: hashedOTP } = userOTPRecord;

    if (new Date(expiresAt).getTime() < Date.now()) {
      await PasswordResetOTP.destroy({ where: { userId } });
      return res.status(400).json({
        status: "FAILED",
        message: "Code has expired. Please request again.",
      });
    }

    // Compare OTP
    const validOTP = await bcrypt.compare(otp, hashedOTP);
    if (!validOTP) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid code passed. Check your inbox for the correct code.",
      });
    }

    let user = await Student.findOne({ where: { email } });
    if (!user) user = await Supervisor.findOne({ where: { email } });
    if (!user) user = await Admin.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "User does not exist" });
    }

    // Update user's verification status
    await user.update({ isPasswordResetVerified: true });

    await PasswordResetOTP.destroy({ where: { email } });

    res.status(200).json({
      status: "VERIFIED",
      message: "Password Reset OTP Verified!",
      redirectUrl: "/resetpassword",
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
