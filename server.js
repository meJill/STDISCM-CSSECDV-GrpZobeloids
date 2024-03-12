// server.js

const express = require('express');
const mysql = require('mysql2');

const app = express();
const config = require('./config');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
<<<<<<< Updated upstream
const upload = multer({ dest: '/path/to/temporary/directory' });
=======
const upload = multer({ dest: './src/images' });
>>>>>>> Stashed changes
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

// MySQL database connection configuration
// DEV NOTE: Set this up in the config.js file because security and all that jazz
<<<<<<< Updated upstream
const db = mysql.createConnection({
  ...config.database,
  maxAllowedPacket: 1024 * 1024 * 50 // 50MB (example value, adjust as needed)
});app.use(cors());

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
=======
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));


app.post('/register', upload.single('photo'), async (req, res) => {
  const { username, password, email, pnumber } = req.body;

  // Get the uploaded file details
  const photoFile = req.file;
  const originalFileName = photoFile.originalname; // Original filename of the uploaded photo
  const photoFilePath = photoFile.path; // This will give you the path of the uploaded photo

  // Determine the appropriate file extension based on the MIME type of the uploaded file
  const fileExtension = path.extname(photoFile.originalname).toLowerCase(); // Get the file extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']; // Supported image file extensions

  // Check if the uploaded file has a supported image file extension
  if (!imageExtensions.includes(fileExtension)) {
    // Handle unsupported file types here
    fs.unlinkSync(photoFilePath);
    return res.status(400).json({ error: 'Unsupported file type' });
>>>>>>> Stashed changes
  }
  console.log('Connected to MySQL database');
  
});

<<<<<<< Updated upstream
app.use(bodyParser.json({ limit: '50mb' }));
=======
  // Construct the new file path with the appropriate image file extension
  const newPhotoFileName = originalFileName; // Keep original filename
  const newPhotoFilePath = originalFileName; // Remove __dirname
>>>>>>> Stashed changes



app.post('/register', upload.single('file'), async (req, res) => {
  const { username, password, email, pnumber, photo } = req.body;

  try {
    var regex = new RegExp("^(?=(?=.*[A-Z]).{1}(?=.*[a-z]).{1}(?=.*[0-9]).{1}(?=.*[^A-Za-z0-9]).{1})([^;]){12,64}$");
    console.log([password])
    if (!regex.test(password)) {
      if (password.length < 12) {
        return res.status(403).json({error: 'Password too short'})
      } else if (password.length > 64 ){
        return res.status(403).json({error: 'Password too long'})
      } else {
        return res.status(403).json({error: 'Invalid Password'})
      }
    } 


    var regex1 = new RegExp("^[0-9a-zA-Z]*([\_\.\-][0-9a-zA-Z]+)*\@[0-9a-zA-Z]*\.[a-zA-Z]{2,}$"); 
    if (!regex1.test(email)) {
      return res.status(400).json({error: 'Invalid email format'})
    }

    var regex2 = new RegExp("^[0-9]{11,12}$");
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database with the hashed password and photo data
    await db.promise().query(
      'INSERT INTO users (username, password, email, phone_no, profile_photo) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, email, pnumber, photo] // Convert base64 data to Buffer
  );

res.status(201).json({ message: 'User registered successfully' });
} catch (error) {
console.error('Error registering user:', error);
res.status(500).json({ error: 'Internal server error' });
}
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user from the database
    const [user] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);

    if (user.length === 1) {
      // User exists, compare passwords
      const hashedPassword = user[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, return success response
        res.status(200).json({ message: 'Login successful', profile_photo: user[0].profile_photo });
      } else {
        // Passwords do not match, return error response
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } else {
      // No user found with provided username, return error response
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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