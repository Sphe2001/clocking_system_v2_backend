const express = require("express");
const bcrypt = require("bcryptjs");
const { Supervisor, Admin } = require("../../models");
const sendOTPVerificationEmail = require("../../helpers/sendOTPVerification");
const UserOTPVerification = require("../../models/userOTPVerification");

const router = express.Router();

router.post("/register/supervisor", async (req, res) => {
  try {
    const {
      staffNo,
      email,
      surname,
      initials,
      contactNo,
      password,
      specialization,
    } = req.body;

    if (!/^\d{6}$/.test(staffNo)) {
      return res
        .status(400)
        .json({ message: "Staff number must be exactly 6 digits." });
    }

    // Validate email format
    const emailRegex = new RegExp(`^[a-zA-Z][a-zA-Z0-9._%+-]*@tut\\.ac\\.za$`);
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Email must start with a letter and end with @tut.ac.za.",
      });
    }

    // Validate contact number (must be 10 digits)
    if (!/^\d{10}$/.test(contactNo)) {
      return res
        .status(400)
        .json({ message: "Contact number must be exactly 10 digits." });
    }

    // Validate surname (must be more than 1 letter)
    if (surname.length < 2) {
      return res
        .status(400)
        .json({ message: "Surname must be at least 2 characters long." });
    }

    // Validate initials (must be at least 1 character)
    if (initials.length < 1) {
      return res
        .status(400)
        .json({ message: "Initials must be at least 1 character long." });
    }

    // Validate password (must be at least 4 characters)
    if (password.length < 4) {
      return res
        .status(400)
        .json({ message: "Password must be at least 4 characters long." });
    }

    const existingStaffNo = await Admin.findOne({ where: { staffNo } });
    if (existingStaffNo) {
      return res.status(400).json({ message: "Staff number already exists" });
    }

    const existingSupervisor = await Supervisor.findOne({ where: { staffNo } });
    if (existingSupervisor) {
      return res.status(400).json({ message: "Staff number already exists" });
    }
    // Check if the email already exists
    const existingEmail = await Supervisor.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new supervisor
    const supervisor = await Supervisor.create({
      staffNo,
      email,
      role: "supervisor",
      surname,
      initials,
      contactNo,
      password: hashedPassword,
      specialization,
      isVerified: false,
    });

    const userId = staffNo;

    await sendOTPVerificationEmail(userId, email);

    res.status(201).json({
      message: "Supervisor registered successfully. Verification OTP sent.",
      supervisor,
    });
  } catch (error) {
    console.error("Error registering supervisor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify OTP
router.post("/verifyotp/supervisor", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ status: "FAILED", message: "Empty OTP details are not allowed" });
    }

    // Fetch OTP record
    const userOTPRecord = await UserOTPVerification.findOne({ where: { userId } });

    if (!userOTPRecord) {
      return res.status(400).json({ status: "FAILED", message: "Account is already verified or does not exist. Please login or register." });
    }

    const { expiresAt, otp: hashedOTP } = userOTPRecord;

    // Check if OTP has expired
    if (expiresAt < Date.now()) {
      await UserOTPVerification.destroy({ where: { userId } });
      return res.status(400).json({ status: "FAILED", message: "Code has expired. Please request again." });
    }

    // Compare OTP
    const validOTP = await bcrypt.compare(otp, hashedOTP);

    if (!validOTP) {
      return res.status(400).json({ status: "FAILED", message: "Invalid code passed. Check your inbox for the correct code." });
    }

    // Update student verification status
    await Supervisor.update({ isVerified: true }, { where: { staffNo: userId } });

    // Delete OTP record
    await UserOTPVerification.destroy({ where: { userId } });

    res.status(200).json({
      status: "VERIFIED",
      message: "Supervisor email verified!"
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      status: "FAILED",
      message: "Internal server error"
    });
  }
});

module.exports = router;
