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
            return res.status(400).json({ message: "Email and password are required" });
        }

        let user = await Student.findOne({ where: { email } });
        let role = "student";

        if (!user) {
            user = await Supervisor.findOne({ where: { email } });
            role = "supervisor";
        }

        if (!user) {
            user = await Admin.findOne({ where: { email } });
            role = "admin";
        }

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const tokenData = {
            role: user.role,
            id: user.studentNo || user.staffNo,
            email: user.email,
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d"
        })

        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict", 
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: "Login successful", success: true, role });

        
        
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }

});

module.exports = router;