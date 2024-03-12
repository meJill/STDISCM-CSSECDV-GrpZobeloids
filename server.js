// server.js

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs'); // Add this line


const config = require('./config');
const { Sequelize } = require('sequelize');
const { Admin, Users } = require('./models');


const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
  host: config.database.host,
  dialect: 'mysql',
});


// MySQL database connection configuration
// DEV NOTE: Set this up in the config.js file because security and all that jazz
const app = express();
app.use(cors());
app.use(bodyParser.json());



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
  }

  // Construct the new file path with the appropriate image file extension
  const newPhotoFileName = originalFileName; // Keep original filename
  const newPhotoFilePath = path.join('uploads', newPhotoFileName); // Remove __dirname

  // Rename the uploaded file with the appropriate image file extension
  fs.renameSync(photoFilePath, newPhotoFilePath);

  try {
    var regex = new RegExp("^(?=(?=.*[A-Z]).{1}(?=.*[a-z]).{1}(?=.*[0-9]).{1}(?=.*[^A-Za-z0-9]).{1})([^;]){12,64}$");
    console.log([password])
    if (!regex.test(password)) {
      if (password.length < 12) {
        fs.unlinkSync(newPhotoFilePath);
        return res.status(403).json({error: 'Password too short'})
      } else if (password.length > 64 ){
        fs.unlinkSync(newPhotoFilePath);
        return res.status(403).json({error: 'Password too long'})
      } else {
        fs.unlinkSync(newPhotoFilePath);
        return res.status(403).json({error: 'Invalid Password'})
      }
    } 


    var regex1 = new RegExp("^[0-9a-zA-Z]*([\_\.\-][0-9a-zA-Z]+)*\@[0-9a-zA-Z]*\.[a-zA-Z]{2,}$"); 
    if (!regex1.test(email)) {
      fs.unlinkSync(newPhotoFilePath);
      return res.status(400).json({error: 'Invalid email format'})
    }

    var regex2 = new RegExp("^[0-9]{11,12}$");
    if (!regex2.test(pnumber)) {
      fs.unlinkSync(newPhotoFilePath);
      return res.status(401).json({error: 'Invalid phone number format'})
    }

    // Check if the username already exists
    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      fs.unlinkSync(newPhotoFilePath);
      return res.status(402).json({ error: 'Username already exists' });
    }



    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database with the hashed password and uploaded photo filename
    const newUser = await Users.create({
      username,
      password: hashedPassword,
      email,
      phone_no: pnumber,
      profile_photo_path: newPhotoFilePath
    });

    res.status(201).json({ message: 'User registered successfully'});
  } catch (error) {
console.error('Error registering user:', error);
res.status(500).json({ error: 'Internal server error' });
}
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await Users.findOne({ where: { username } });

    if (user) {
      // User exists, compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Passwords match, return success response
        res.status(200).json({ message: 'Login successful', profile_photo: user.profile_photo_path });
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

module.exports = { sequelize };
