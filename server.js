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
const axios = require('axios');

const https = require('https');
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

// Log file paths
const authLogPath = path.join('logs', 'auth.log');
const transactionLogPath = path.join('logs', 'transaction.log');
const adminLogPath = path.join('logs', 'admin.log');

// Function to write logs
const writeToLog = (logPath, message) => {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(logPath, logMessage, (err) => {
    if (err) {
      console.error(`Error writing to log file ${logPath}:`, err);
    }
  });
};

// Function to log messages related to database connection
const logTransaction = (message) => {
  writeToLog(transactionLogPath, message);
};

// Function to log messages related to user registration
const logAuth = (message) => {
  writeToLog(authLogPath, message);
};

// Function to log messages related to admin
const logAdmin = (message) => {
  writeToLog(adminLogPath, message);
};


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
    logAuth('User \'' + username + '\' added successfully');
    res.status(201).json({ message: 'User registered successfully', profile_photo: photoUrl });
  } catch (error) {
    logAuth('Authentication Error: ' + error);
console.error('Error registering user:', error);
res.status(500).json({ error: 'Internal server error' });
}
});

app.post('/getPhoto', async (req, res) => {
  const {username, password} = req.body
  console.log(req.body)
  try {
    const [user] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);

    // console.log(user[0].password)

    if (user.length === 1) {
      // User exists, compare passwords
      const hashedPassword = user[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      if (!passwordMatch) {
        // Passwords match, return success response
        res.status(401).json({ error: 'Login' })
      }
      // console.log(user[0].profile_photo_path)
      // console.log(user[0].profile_photo_path);
      const path = user[0].profile_photo_path.slice(4).replace("\\", "/")
      // console.log(path)
      // console.log(path)
      res.status(200).json({profile_photo: path});
    }
  } catch (error) {
    
  }
  

  
});

// Function to verify reCAPTCHA token
async function verifyRecaptchaToken(token) {
  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: config.google_private_key,
        response: token,
      },
    });
    logAuth('reCAPTCHA verification response: '+ response.data.success)
    console.log('reCAPTCHA verification response:', response.data);

    return response.data.success;
  } catch (error) {
    logAuth('Error verifying reCAPTCHA token:'+ response.data.error)
    console.error('Error verifying reCAPTCHA token:', error);
    return false;
  }
}



app.post('/isLoginA', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user from the database and make sure not to get deleted users
    const [admin] = await db.promise().query('SELECT * FROM admin WHERE username = ?', [username]);

    if (admin.length === 1) {
      // User exists, compare passwords
      const hashedPassword = admin[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, return success response
        // logAdmin("/'" + username + "\' still logged in")
        res.status(200).json({ message: 'Login successful', user_id: admin[0].user_id});
      } else {
        // Passwords do not match, return error response
        logAdmin(username + ": Password does not match");
        res.status(401).json({ error: 'Invalid username or password or accessing unauthorized pages' });
      }
    } else {
      // No user found with provided username, return error response
      logAdmin("User \'" + username + "\' not found");
      res.status(401).json({ error: 'Invalid username or password or accessing unauthorized pages' });
    }
  } catch (error) {
    logAdmin(error)
    console.error('Accessing unauthorized pages: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/loginA', async (req, res) => {
  const { username, password, captchaToken } = req.body;

  try {    
    // Verify the reCAPTCHA token
    const isRecaptchaVerified = await verifyRecaptchaToken(captchaToken);

    if (!isRecaptchaVerified) {
      console.log('reCAPTCHA verification failed');
      return res.status(403).json({ error: 'reCAPTCHA verification failed' });
    }


    // Fetch admin from the database and make sure not to get deleted users
    const [admin] = await db.promise().query('SELECT * FROM admin WHERE username = ?', [username]);

    if (admin.length === 1) {
      // User exists, compare passwords
      const hashedPassword = admin[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, return success response
        logAdmin("/'" + username + "\' successful login")
        res.status(200).json({ message: 'Login successful', user_id: admin[0].user_id});
      } else {
        // Passwords do not match, return error response
        logAdmin("/'" + username + "\' password does not match")
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } else {
      // No user found with provided username, return error response
      logAdmin("\'" + username + "\' does not exist")
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    logAdmin('Error logging in user:', error)
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

app.post('/login', async (req, res) => {
  const { username, password, captchaToken } = req.body;
  console.log(req.body)

  try {    
    // Verify the reCAPTCHA token
    const isRecaptchaVerified = await verifyRecaptchaToken(captchaToken);

    if (!isRecaptchaVerified) {
      console.log('reCAPTCHA verification failed');
      return res.status(403).json({ error: 'reCAPTCHA verification failed' });
    }


    // Fetch user from the database and make sure not to get deleted users
    const [user] = await db.promise().query('SELECT * FROM users WHERE username = ? AND deleted_at IS NULL;', [username]);

    if (user.length === 1) {
      // User exists, compare passwords
      const hashedPassword = user[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, return success response
        logAuth(username + " successful login");
        res.status(200).json({ message: 'Login successful', profile_photo: user[0].profile_photo_path , user_id: user[0].user_id});
      } else {
        // Passwords do not match, return error response
        logAuth("\'" + username + "\' Password does not match");
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } else {
      // No user found with provided username, return error response
      logUserLoginError("\'" + username  + "\' not found");
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    logAuth('Error logging in user: ' + error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

// GET user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const [user] = await db.promise().query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to edit user details by user ID
app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, phone_no } = req.body;

  try {
    // Update the user details in the database based on the user ID
    await db.promise().query(
      'UPDATE users SET username = ?, email = ?, phone_no = ? WHERE user_id = ?',
      [username, email, phone_no, userId]
    );

    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/admin-login-page', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch admin from the database
    const [admin] = await db.promise().query('SELECT * FROM admin WHERE username = ?', [username]);

    if (admin.length === 1) {
      // Admin exists, compare passwords
      const hashedPassword = admin[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, return success response
        res.status(200).json({ message: 'Login successful', admin_id: admin[0].admin_id});
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
      const ext = path.extname(file.originalname).toLowerCase(); // Get the file extension
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];

      // Check if the file extension is allowed
      if (allowedExtensions.includes(ext)) {
        // Generate a unique filename to prevent conflicts
        const filename = `${Date.now()}${ext}`;
        filePath = path.join('src', 'user_post_uploads', filename); // Save file in src/user_post_uploads directory
        await fs.promises.rename(file.path, filePath); // Rename and move the file to the src/user_post_uploads directory
      } else {
        logTransaction("Error adding post \'" + title + "\': Invalid file type " + file)
        throw new Error('Invalid file type');
      }
    }

    // Insert the new post into the database
    await db.promise().query(
      'INSERT INTO user_posts (title, body, file_path, user_id) VALUES (?, ?, ?, ?)',
      [title, body, filePath, user_id]
    );
    logTransaction("File input successful: " + title + " || " + body + " || " + filePath)
    res.status(201).json({ message: 'User post added successfully' });
  } catch (error) {
    logTransaction('Error adding user post:', error);
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

// Route to fetch all posts
app.get('/api/posts', async (req, res) => {
  try {
    // Fetch all posts from the database
    const [posts] = await db.promise().query('SELECT * FROM user_posts');
    logTransaction('Fetched all posts');
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    logTransaction('Error fetching all posts: ' + error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all posts by a given user_id
app.get('/api/posts/:user_id', async (req, res) => {
  const user_id = req.params.user_id;

  try {
    // Fetch posts from the database based on the user_id
    const [posts] = await db.promise().query(
      'SELECT * FROM user_posts WHERE user_id = ?',
      [user_id]
    );
    logTransaction('Fetched all posts by user_id: '+ user_id);
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    logTransaction('Error fetching posts from user_id: ' + user_id + ' Error code: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to edit a post by its ID
app.put('/api/posts/:post_id', async (req, res) => {
  const post_id = req.params.post_id;
  const { title, body } = req.body;

  try {
    // Update the post in the database based on the post_id
    await db.promise().query(
      'UPDATE user_posts SET title = ?, body = ? WHERE post_id = ?',
      [title, body, post_id]
    );
    logTransaction('Post id: ' + post_id + ' updated successfully');
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    logTransaction('Error updating post' + error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a post by its ID
app.delete('/api/posts/:post_id', async (req, res) => {
  const post_id = req.params.post_id;

  try {
    // Delete the post from the database based on the post_id
    await db.promise().query('DELETE FROM user_posts WHERE post_id = ?', [post_id]);
    logTransaction('Post id: '+ post_id + ' deleted successfully')
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    logTransaction('Error deleting post: ' + error)
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    // Fetch all posts from the database
    const [users] = await db.promise().query('SELECT * FROM users WHERE deleted_at IS NULL');
    logAdmin('Fetched all users');
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    logAdmin('Error fetching users:' + error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to edit a user by its ID
app.put('/api/users/edit/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  const { username, email, phone_no } = req.body;

  try {
    // Update the user in the database based on the user_id
    await db.promise().query(
      'UPDATE users SET username = ?, email = ?, phone_no = ?, WHERE user_id = ?',
      [username, email, phone_no, user_id]
    );
    logTransaction("\'" + user_id + "\' succesful update: " + username + " || " + email + " || " + phone_no) 
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    logTransaction("Error updating \'" + user_id + "\': " + error)
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to soft delete a user by its ID
app.put('/api/users/delete/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    // Delete the user from the database based on the user_id
    await db.promise().query('UPDATE users SET deleted_at = ? WHERE user_id = ?', [date, user_id]);
    logAdmin("\'" + user_id + "\' successfully deleted")
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    logAdmin("\'" + user_id + "\' error deleting user: " + error)
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
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});