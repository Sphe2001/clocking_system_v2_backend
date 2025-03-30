const express = require("express");

const login = require("./login");
const logout = require("./logout");
const registerAdmin = require("./registerAdmin");
const registerStudent = require("./registerStudent");
const registerSupervisor = require("./registerSupervisor");

const router = express.Router();

router.use(login);
router.use(logout);
router.use(registerAdmin);
router.use(registerStudent);
router.use(registerSupervisor);

module.exports = router;
