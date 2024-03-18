// server.js

const express = require('express');
const mysql = require('mysql2');

const app = express();
const config = require('./config');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'src/images/' }); // Destination folder for uploaded files
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');


// Function to check if the database exists
const checkDatabaseExists = () => {
  return new Promise((resolve, reject) => {
    db.query('SHOW DATABASES LIKE ?', [config.database.database], async (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          try {
            // Check if the necessary tables exist in the database
            const tablesExist = await checkTablesExist();
            resolve(tablesExist);
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(false); // Database does not exist
        }
      }
    });
  });
};

const checkTablesExist = () => {
  return new Promise((resolve, reject) => {
    db.query('SHOW TABLES', (err, results) => {
      if (err) {
        reject(err);
      } else {
        // Extract table names from the results
        const tables = results.map((row) => Object.values(row)[0]);
        const requiredTables = ['users', 'admin']; // Modify this array with the required table names

        // Check if all required tables exist
        const allTablesExist = requiredTables.every((table) => tables.includes(table));
        resolve(allTablesExist);
      }
    });
  });
};

// MySQL database connection configuration
// DEV NOTE: Set this up in the config.js file because security and all that jazz
const db = mysql.createConnection(config.database);
app.use(cors());



// Function to create the database using SQL script file
const createDatabase = () => {
  const sqlFilePath = `${__dirname}/schema.sql`; // Update this with your SQL script file path

  fs.readFile(sqlFilePath, 'utf8', (err, sqlScript) => {
    if (err) {
      throw err;
    }

    // Execute the SQL script to create the database
    db.query(sqlScript, (err) => {
      if (err) {
        throw err;
      }

      console.log('Database created successfully');
    });
  });
};

// Connect to MySQL and create database if not exists
db.connect(async (err) => {
  if (err) {
    throw err;
  }

  console.log('Connected to MySQL Database');

  try {
    const databaseExists = await checkDatabaseExists();

    if (!databaseExists) {
      console.log('Database does not exist. Creating...');
      createDatabase();
    } else {
      console.log('Database already exists, no need to create');
    }
  } catch (error) {
    console.error('Error checking or creating database:', error);
  }
});


app.use(bodyParser.json());

app.post('/register', upload.single('photo'), async (req, res) => {
  const { username, password, email, pnumber } = req.body;

  // Get the uploaded file details
  const photoFile = req.file;
  const photoFileName = photoFile.filename; // This will give you the filename of the uploaded photo
  const photoFilePath = photoFile.path; // This will give you the path of the uploaded photo

  // Determine the appropriate file extension based on the MIME type of the uploaded file
  const fileExtension = path.extname(photoFile.originalname).toLowerCase(); // Get the file extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']; // Supported image file extensions


  // Check if the uploaded file has a supported image file extension
  if (!imageExtensions.includes(fileExtension)) {
    // Handle unsupported file types here
    return res.status(400).json({ error: 'Unsupported file type' });
  }

  // Construct the new file path with the appropriate image file extension
  const newPhotoFilePath = photoFilePath + fileExtension;

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
    const [existingUser] = await db.promise().query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      fs.unlinkSync(newPhotoFilePath);
      return res.status(402).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database with the hashed password and uploaded photo filename
    await db.promise().query(
      'INSERT INTO users (username, password, email, phone_no, profile_photo_path) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, email, pnumber, newPhotoFilePath]
    );
    const photoUrl = `${newPhotoFilePath}`;
    res.status(201).json({ message: 'User registered successfully', profile_photo: photoUrl });
  } catch (error) {
console.error('Error registering user:', error);
res.status(500).json({ error: 'Internal server error' });
}
});

app.post('/loggedIn', async (req, res) => {
  const {username} = req.body
  console.log(req.body)
  console.log({username})
  try {
    const [user] = await db.promise().query('SELECT profile_photo_path FROM users WHERE username = ?', [username]);
    console.log(user[0]);
    const path = user[0]['profile_photo_path'].slice(4).replace("\\", "/")
    console.log(path)
    res.status(200).json({profile_photo: path});
  } catch (error) {
    
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
        res.status(200).json({ message: 'Login successful', profile_photo: user[0].profile_photo , user_id: user[0].user_id});
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


// Add a post with a file (if added) to the database
app.post('/api/addUserPost', upload.single('file'), async (req, res) => {
  const { title, body, user_id } = req.body;
  const file = req.file;

  try {
    let filePath = null;

    if (file) {
      filePath = file.path; // Get the path of the uploaded file
    }

    // Insert the new post into the database
    await db.promise().query(
      'INSERT INTO user_posts (title, body, file_path, user_id) VALUES (?, ?, ?, ?)',
      [title, body, filePath, user_id]
    );

    res.status(201).json({ message: 'User post added successfully' });
  } catch (error) {
    console.error('Error adding user post:', error);
    res.status(500).json({ error: 'Internal server error' });

    // If an error occurs during the uploading process, delete the file
    if (file && filePath) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }
  }
});

// Define a route to fetch all posts by a given user_id
app.get('/api/posts/:user_id', async (req, res) => {
  const user_id = req.params.user_id;

  try {
    // Fetch posts from the database based on the user_id
    const [posts] = await db.promise().query(
      'SELECT * FROM user_posts WHERE user_id = ?',
      [user_id]
    );

    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a route to delete a post by its ID
app.delete('/api/posts/:post_id', async (req, res) => {
  const post_id = req.params.post_id;

  try {
    // Delete the post from the database based on the post_id
    await db.promise().query('DELETE FROM user_posts WHERE post_id = ?', [post_id]);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
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