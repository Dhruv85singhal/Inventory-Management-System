// routes/card.js
const express = require('express');
const { validateCard } = require('../controller/cardController');
const router = express.Router();

// Route for card validation
router.post('/validate', validateCard);

module.exports = router;
