const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); 
const itemRoutes = require('./routes/items'); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use the auth routes for /api/auth path
app.use('/api/auth', authRoutes);
app.use('/api/stock', itemRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
