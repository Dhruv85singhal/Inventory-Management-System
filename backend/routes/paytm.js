// routes/paytm.js
const express = require('express');
const { validatePaytm } = require('../controller/paytmController');
const router = express.Router();

// Route for Paytm validation
router.post('/validate', validatePaytm);

module.exports = router;
