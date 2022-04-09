const express = require('express')
const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// Register
router.post('/register', authController.registerUser)
// Login
router.post('/login', authController.loginUser)
// Refresh token
router.post('/refresh', authController.requestRefreshToken)
// Log out
router.post('/logout', authMiddleware.verifyToken,authController.logoutUser)

module.exports = router

