const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
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
app.use(cors());

// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password ) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Check if user already exists
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    const role="User";
    // Insert new user into the database
    const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error registering user', error: err });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result[0];
    
    // Compare the provided password with the hashed password stored in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log(user.role);
    // Return the role if password matches
    return res.status(200).json({ message: `${user.role} login successful`, role: user.role,id:user.id });
  });
});

// Add vehicle endpoint
// Add Vehicle
app.post('/add-vehicle', (req, res) => {
  const { userId, vehicleNumber, vehicleType, model, color } = req.body;

  const query = 'INSERT INTO vehicles (user_id, vehicle_number, vehicle_type, model, color) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [userId, vehicleNumber, vehicleType, model, color], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding vehicle', error: err });
    }
    res.status(200).json({ message: 'Vehicle added successfully', vehicleId: result.insertId });
  });
});

// Get Vehicles by User ID
app.get('/get-vehicle/:userId', (req, res) => {
  const { userId } = req.params;
  
  const query = 'SELECT * FROM vehicles WHERE user_id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching vehicles', error: err });
    }
    res.status(200).json(result);
  });
});

// Update Vehicle
app.put('/update-vehicle/:vehicleId', (req, res) => {
  const { vehicleId } = req.params;
  const { vehicleNumber, vehicleType, model, color } = req.body;

  const query = 'UPDATE vehicles SET vehicle_number = ?, vehicle_type = ?, model = ?, color = ? WHERE id = ?';
  db.query(query, [vehicleNumber, vehicleType, model, color, vehicleId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating vehicle', error: err });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Vehicle updated successfully' });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  });
});

// Delete Vehicle
app.delete('/delete-vehicle/:vehicleId', (req, res) => {
  const { vehicleId } = req.params;

  const query = 'DELETE FROM vehicles WHERE id = ?';
  db.query(query, [vehicleId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting vehicle', error: err });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  });
});




app.post('/register-officer', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert the officer into the database
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error registering officer', error: err });
      }
      res.status(201).json({ message: 'Officer registered successfully', officerId: result.insertId });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error hashing password', error: err });
  }
});

// Set up the port and listen for incoming requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
