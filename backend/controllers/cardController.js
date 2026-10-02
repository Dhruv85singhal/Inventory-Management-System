// controller/cardController.js
const db = require('../config/db');

// Card validation
const validateCard = (req, res) => {
  const { number, name, expiry, cvv } = req.body;

  const sql = 'SELECT * FROM card_users WHERE card_number = ? AND cardholder_name = ? AND expiry = ? AND cvv = ?';
  db.query(sql, [number, name, expiry, cvv], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
    if (result.length > 0) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid card details' });
    }
  });
};

module.exports = { validateCard };
