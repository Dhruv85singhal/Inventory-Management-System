const express = require('express');
const router = express.Router();
const db = require('../config/db');  

// Route to add a new product to stock
router.post('/add', (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || !price || !quantity) {
    return res.status(400).json({ error: 'Name, price, and quantity are required' });
  }

  // Insert the new product into the items table
  const query = 'INSERT INTO items (name, price, quantity) VALUES (?, ?, ?)';
  db.query(query, [name, price, quantity], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add product' });
    }

    res.status(201).json({ message: 'Product added successfully' });
  });
});

// Route to get all products in stock (for Admin Dashboard)
router.get('/', (req, res) => {
  const query = 'SELECT * FROM items';  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    res.status(200).json(results);  
  });
});

// Route to delete a product by ID (Admin only)
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM items WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  });
});

// Route to update a product's quantity by ID (Admin only)
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be a positive number' });
  }

  const query = 'UPDATE items SET quantity = ? WHERE id = ?';
  db.query(query, [quantity, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update product quantity' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product quantity updated successfully' });
  });
});

// Route to update a product's price by ID (Admin only)
router.put('/updatePrice/:id', (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  // Ensure price is valid
  if (price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  const query = 'UPDATE items SET price = ? WHERE id = ?';
  db.query(query, [price, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update product price' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product price updated successfully' });
  });
});

module.exports = router;
