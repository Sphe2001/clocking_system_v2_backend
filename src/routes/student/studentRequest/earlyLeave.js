const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { studentRequestModel } = require ("../../../models");

dotenv.config();
const router = express.Router();
router.use(cookieParser());

router.post('/leave-request', async (req, res) => {
    try {
        const { studentId, reason } = req.body;
        const newRequest = await studentRequestModel.create(
            { studentNo : studentId,
            reason: reason }
        );
        res.status(201).json({ message: 'Leave request submitted successfully', request: newRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;