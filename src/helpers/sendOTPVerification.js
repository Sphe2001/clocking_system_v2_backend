const dotenv = require("dotenv");
const UserOTPVerification = require("../models/userOTPVerification");
const transporter = require("./emailer");
const bcrypt = require("bcryptjs");

dotenv.config();

const sendOTPVerificationEmail = async (userId, email) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOption = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the registration.</p>
            <p> This code <b>expires in 1 hour</b>. </p>`,
    };

    //hash the opt
    const salt = 10;
    const hashedOTP = await bcrypt.hash(otp, salt);

    const newOTPVerification = await new UserOTPVerification({
      userId: userId,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOTPVerification.save();
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

module.exports = sendOTPVerificationEmail;
