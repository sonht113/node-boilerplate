const express = require('express')
const authMiddleware = require('../middleware/auth')
const userController = require('../controllers/user.controller')
const router = express.Router()

// Get user
router.get('/', authMiddleware.verifyToken, userController.getAllUser)

// Delete User
router.delete('/:id', authMiddleware.verifyTokenAndAdmin, userController.deleteUser)

module.exports = router