const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Correct import path

// Register a user
router.post('/register', authController.registerUser);

// Login a user
router.post('/login', authController.loginUser);

module.exports = router; // Export the router
