const express = require('express')
const authController = require("../controllers/auth.controller");
const router = express.Router()

// Register
router.post('/register', authController.registerUser)
// Login
router.post('/login', authController.loginUser)

module.exports = router

