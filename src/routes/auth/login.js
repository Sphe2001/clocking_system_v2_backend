const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { Student, Supervisor, Admin } = require("../../models");

dotenv.config();
const router = express.Router();
router.use(cookieParser());

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let user = await Student.findOne({ where: { email } });
    let role = "student";

    if (!user) {
      user = await Supervisor.findOne({ where: { email } });
      if (user) role = "supervisor";
    }

    if (!user) {
      user = await Admin.findOne({ where: { email } });
      if (user) role = "admin";
    }

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Account not verified. Please verify your email.",
        redirectUrl: "/verifyemail",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userId = user.studentNo || user.staffNo || user.id;

    const tokenData = {
      role,
      id: userId,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    let redirectUrl = "/";
    if (role === "student") redirectUrl = "/dashboard/student";
    else if (role === "supervisor") redirectUrl = "/dashboard/supervisor";
    else if (role === "admin") redirectUrl = "/dashboard/admin";

    res.status(200).json({
      message: "Login successful",
      success: true,
      role,
      redirectUrl,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

module.exports = router;
