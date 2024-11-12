const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const nodemailer = require('nodemailer');
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



const sendEmail = async (userEmail,subject,text) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,  // Use 465 for SSL
        secure: true, // Set to true for SSL
        auth: {
            user: process.env.USER, // Your Gmail address
            pass: process.env.PASS, // Your Gmail app password
        },
    });    
    
        
    
        const mailOptions = {
            from: process.env.USER,
            to: userEmail, // Make sure to store and use the user's email in the reminder
            subject,
            text,
        };
    
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

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


// Fetch all violations
app.get("/violations", (req, res) => {
  const query = "SELECT * FROM violations";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching violations" });
    }
    res.json(results);
  });
});

app.post("/add-challans", (req, res) => {
  const { vehicleNumber, vehicleType, issueDate, amount, issueType, officerId } = req.body;

  // First, fetch the userId associated with the vehicleNumber
  const getUserIdQuery = "SELECT user_id FROM vehicles WHERE vehicle_number = ?";

  db.query(getUserIdQuery, [vehicleNumber], (err, result) => {
    if (err) {
      console.error("Error fetching userId:", err);
      return res.status(500).json({ message: "Failed to fetch userId." });
    }

    if (result.length === 0) {
      // If no user is found for the vehicle number
      return res.status(404).json({ message: "Vehicle not found." });
    }

    const userId = result[0].user_id; // Get the userId from the result
    console.log(userId);
     
    const getUserEmailQuery = "SELECT email FROM users WHERE id = ?";

    db.query(getUserEmailQuery, [userId], (err, userResult) => {
      if (err) {
        console.error("Error fetching user email:", err);
        return res.status(500).json({ message: "Failed to fetch user email." });
      }

      if (userResult.length === 0) {
        // If no user found with the given userId
        return res.status(404).json({ message: "User not found." });
      }

      const userEmail = userResult[0].email;
      subject="Challan regarding";
      text=`your vehicle numbered ${vehicleNumber} has been fined a challan under ${issueType} with amount ${amount} on ${issueDate} please pay the fine within 10 days`;
      sendEmail(userEmail,subject,text); // Get the user email
  })
    
    // Now insert the challan using the fetched userId
    const sql = `
      INSERT INTO challans (vehicleNumber, vehicleType, issueDate, amount, issueType, officerId, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [vehicleNumber, vehicleType, issueDate, amount, issueType, officerId, userId], (err, result) => {
      if (err) {
        console.error("Error inserting challan:", err);
        return res.status(500).json({ message: "Failed to issue challan." });
      }
      res.status(200).json({ message: "Challan issued successfully", challanId: result.insertId });
    });
  });
});


app.get("/challans", (req, res) => {
  const { officerId } = req.query;

  // Validate officerId
  if (!officerId) {
    return res.status(400).json({ message: "Officer ID is required" });
  }

  // Query to fetch challans for the given officerId
  const sql = "SELECT * FROM challans WHERE officerId = ?";

  db.query(sql, [officerId], (err, results) => {
    if (err) {
      console.error("Error fetching challans:", err);
      return res.status(500).json({ message: "Failed to retrieve challans" });
    }
    console.log(results);
    res.status(200).json(results); // Send the filtered challans
  });
});


app.get("/get-challans/:userId", (req, res) => {
  const userId = req.params.userId; // Get userId from URL parameters
  const query = `
    SELECT * FROM challans
    WHERE userId = ?; 
  `;
  
  db.query(query, [userId, userId], (err, result) => {
    if (err) {
      console.error("Error fetching challans:", err);
      return res.status(500).json({ message: "Failed to fetch challans." });
    }
    console.log(result);
    res.status(200).json(result);
  });
});

app.post('/pay-challan/:challanId', (req, res) => {
  const challanId = req.params.challanId;
  const query = `UPDATE challans SET status = 'paid' WHERE challanId = ?`;
  console.log(challanId);
  db.query(query, [challanId], (err, results) => {
    if (err) {
      console.error('Error paying challan', err);
      return res.status(500).json({ message: 'Error paying challan' });
    }
    res.status(200).json({ message: 'Challan status updated to paid' });
  });
});

// POST /store-payment
app.post('/store-payment', (req, res) => {
  const { paymentId, challanId } = req.body;
  const query = `INSERT INTO payment_details (paymentId, challanId, date) VALUES (?, ?, NOW())`;

  db.query(query, [paymentId, challanId], (err, results) => {
    if (err) {
      console.error('Error storing payment details', err);
      return res.status(500).json({ message: 'Error storing payment details' });
    }

    // Update challan status to paid
    const updateChallanQuery = `UPDATE challans SET status = 'paid' WHERE challanId = ?`;
    db.query(updateChallanQuery, [challanId], (updateErr, updateResults) => {
      if (updateErr) {
        console.error('Error updating challan status', updateErr);
        return res.status(500).json({ message: 'Error updating challan status' });
      }
      res.status(200).json({ message: 'Payment details stored successfully' });
    });
  });
});

app.get('/get-username/:userId', async (req, res) => {
  const userId = req.params.userId; // Get userId from URL parameters
  const query = `
    SELECT name FROM users
    WHERE id = ?;
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Failed to fetch user." });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const username = result[0].name;
    res.status(200).json({ name: username });
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
