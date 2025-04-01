const express = require("express");
const { Op } = require("sequelize");
const StudentAttendance = require("../../models/studentAttendance");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const getDataFromToken = require("../../helpers/getUserId");

const router = express.Router();
dotenv.config();
router.use(cookieParser());

// Helper function to get the current date in 'dd Mon yyyy hh:mm' format
const formatDate = (date) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

// POST /clock-in route
router.post("/clock-in", async (req, res) => {
  try {
    // Extract userId from token
    const userId = getDataFromToken(req);
    console.log(userId);

    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }

    const currentDate = new Date();
    const formattedDate = formatDate(currentDate); // Format current date

    // Check if the student has already clocked in today
    const existingClockIn = await StudentAttendance.findOne({
      where: {
        studentNo: userId,
        clock_in: {
          [Op.gte]: new Date(`${formattedDate}T00:00:00Z`),
          [Op.lt]: new Date(`${formattedDate}T23:59:59Z`),
        },
      },
    });

    if (existingClockIn) {
      return res.status(400).json({ error: "You have already clocked in today" });
    }

    // Create a new attendance record (clock-in)
    const attendanceRecord = await StudentAttendance.create({
      studentNo: userId,
      clock_in: currentDate, // Set the current timestamp for clock-in
    });

    return res.json({
      message: "Clock-in successful",
      success: true,
      attendanceRecord,
    });
  } catch (error) {
    console.error("Error in clock-in:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        details: error.errors.map((e) => e.message),
      });
    }

    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
});

module.exports = router;
