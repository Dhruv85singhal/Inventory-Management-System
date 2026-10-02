// backend/controller/paytmController.js

const validatePaytm = (req, res) => {
    const { upiId, paytmPin } = req.body;
  
    if (!upiId || !paytmPin) {
      return res.status(400).json({ message: "UPI ID and Paytm PIN are required." });
    }
  
    if (upiId === 'validupi@paytm' && paytmPin === '123456') {
      return res.status(200).json({ message: 'Payment successful.' });
    } else {
      return res.status(400).json({ message: 'Invalid UPI ID or Paytm PIN.' });
    }
  };
  
  module.exports = { validatePaytm };
  