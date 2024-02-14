// server.js

const express = require('express');
const mysql = require('mysql2');

const app = express();
const config = require('./config');
const bodyParser = require('body-parser');

const cors = require('cors');

// MySQL database connection configuration
// DEV NOTE: Set this up in the config.js file because security and all that jazz
const db = mysql.createConnection(config.database);


// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
  
});

app.use(cors());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;
  console.log(req.body)
  // Perform authentication logic here
  // For demonstration, assuming a simple check
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 1) {
      // User exists, return success response
      res.status(200).json({ message: 'Login successful' });
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