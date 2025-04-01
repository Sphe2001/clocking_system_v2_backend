const router = require("../../auth/login");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { supervisorReviewModel } = require ("../../../models");

dotenv.config();
const router = express.Router();
router.use(cookieParser());

router.get('/leave-requests', async (req, res) => {
    try {
        const requests = await studentRequestModel.findAll();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint for supervisors to update request status
router.put('/leave-request/:id', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const request = await studentRequestModel.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        request.status = status;
        await request.save();
        res.status(200).json({ message: 'Request updated successfully', request });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
router.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = router;