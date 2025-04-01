const express = require("express");

const login = require("./login");
const logout = require("./logout");
const registerAdmin = require("./registerAdmin");
const registerStudent = require("./registerStudent");
const registerSupervisor = require("./registerSupervisor");
const requestPasswordReset = require("./requestPasswordReset");
const verifyPasswordResetOTP = require("./verifyPasswordResetOTP");
const resetPassword = require("./resetPassword");

const router = express.Router();

router.use(login);
router.use(logout);
router.use(registerAdmin);
router.use(registerStudent);
router.use(registerSupervisor);
router.use(requestPasswordReset);
router.use(verifyPasswordResetOTP);
router.use(resetPassword);

module.exports = router;
