const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAILER_USER,
    pass: process.env.EMAILER_PASS,
  },
});

module.exports = transporter;
