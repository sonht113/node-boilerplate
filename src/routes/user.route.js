const express = require('express')
const middlewareController = require('../controllers/middleware.controller')
const userController = require('../controllers/user.controller')
const router = express.Router()

// Get user
router.get('/', middlewareController.verifyToken, userController.getAllUser)

// Delete User
router.delete('/:id', middlewareController.verifyTokenAndAdmin, userController.deleteUser)

module.exports = router