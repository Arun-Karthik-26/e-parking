const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const CORS= require('CORS');
require('dotenv').config();

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234', // Replace with your MySQL password
  database: 'e_parking', // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(CORS())
// Login endpoint to check user details and return the role
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }
  

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    console.log("result = ", result);
    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result[0];
    var  isMatch=false;
    if(user.password==password)
    {
      console.log("passwords matches");
      isMatch=true;
    }
    // Compare the provided password with the hashed password stored in DB
    // const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return the role if password matches
    return res.status(200).json({ message: `${user.role} login successful`, role: user.role });
  });
});

// Set up the port and listen for incoming requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
