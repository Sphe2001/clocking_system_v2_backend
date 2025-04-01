const dotenv = require("dotenv");
const PasswordResetOTP = require("../models/passwordResetOTP");
const transporter = require("./emailer");
const bcrypt = require("bcryptjs");

dotenv.config();

const sendResetPasswordOTP = async (email) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOption = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<p>Enter <b>${otp}</b> in the app to reset your password.</p>
            <p> This code <b>expires in 1 hour</b>. </p>`,
    };

    //hash the opt
    const salt = 10;
    const hashedOTP = await bcrypt.hash(otp, salt);

    const newPasswordResetOTP = await new PasswordResetOTP({
      email: email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newPasswordResetOTP.save();
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

module.exports = sendResetPasswordOTP;
