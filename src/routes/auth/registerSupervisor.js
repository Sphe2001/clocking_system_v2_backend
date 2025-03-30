const express = require("express");
const bcrypt = require("bcryptjs");
const { Supervisor } = require("../../models");

const router = express.Router();


router.post("/register/supervisor", async (req, res) => {
    try {
      const { staffNo, email, surname, initials, contactNo, password, specialization } = req.body;
  
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
      });
  
      res
        .status(201)
        .json({ message: "Supervisor registered successfully", supervisor });
    } catch (error) {
      console.error("Error registering supervisor:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  module.exports = router;