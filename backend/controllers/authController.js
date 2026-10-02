const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Database connection

// Register user
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    
    db.query(query, [username, email, hashedPassword, role], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login user
const loginUser = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    try {
      const isMatch = await bcrypt.compare(password, user.password); // Compare hashed passwords
      
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Do not include the password in the response
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

module.exports = { registerUser, loginUser }; // Export the controller
