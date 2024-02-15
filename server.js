// server.js

const express = require('express');
const mysql = require('mysql2');

const app = express();
const config = require('./config');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: '/path/to/temporary/directory' });
const cors = require('cors');
const path = require('path');

// MySQL database connection configuration
// DEV NOTE: Set this up in the config.js file because security and all that jazz
const db = mysql.createConnection(config.database);
app.use(cors());

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
  
});

app.use(bodyParser.json());

app.post('/register', upload.single('file'), async (req, res) => {
  const { username, password, email, pnumber, photo} = req.body;

  try {
    var regex = new RegExp("^[\da-zA-Z]*([\_\.\-][\da-zA-Z]+)*\@[\da-zA-Z]*\.[a-zA-Z]{2,}$"); 
    if (!regex.test(email)) {
      return res.status(400).json({error: 'Invalid email format'})
    }

    var regex2 = new RegExp("^\b{11,12}$");
    if (!regex2.test(pnumber)) {
      return res.status(401).json({error: 'Invalid phone number format'})
    }

    // Check if the username already exists
    const [existingUser] = await db.promise().query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(402).json({ error: 'Username already exists' });
    }

    // Insert the new user into the database
    await db.promise().query(
      'INSERT INTO users (username, password, email, phone_no, profile_photo) VALUES (?, ?, ?, ?, ?)',
      [username, password, email, pnumber, photo]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}); 

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 1) {
      // User exists, return success response
      
      res.status(200).json({ message: 'Login successful', test: results.profile_photo });
    } else {
      // No user found with provided credentials, return error response
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});


// Define routes for CRUD operations
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM your_table', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(result);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});