import classes from "./SignUpPage.module.css";
import Card from "../components/ui/Card";
import React, { useState } from "react";
import axios from "axios";

function SignUpPage() {
<<<<<<< Updated upstream
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [pnumber, setPnumber] = useState('');
    const [photo, setPhoto] = useState('');
    const [error, setError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false); // New state variable

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', { username, password, email, pnumber, photo });
            setError('');
            setSignupSuccess(true);
            console.log('Signup successful:', response.data);
        } catch (error) {
            console.error('Signup failed:', error);
            setError(error.response.data.error);
            setSignupSuccess(false); // Reset signupSuccess to false if error occurs
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            // Convert the file data to base64 encoding
            setPhoto(reader.result);
        };

        reader.readAsDataURL(file);
    };
=======
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [pnumber, setPnumber] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      // Create FormData object and append form data
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("pnumber", pnumber);
      formData.append("photo", photo); // Append photo file

      // Send POST request with form data to /register endpoint
      const response = await axios.post(
        "http://localhost:5000/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
>>>>>>> Stashed changes

      // Reset error and set signup success
      setError("");
      setSignupSuccess(true);
      setProfilePhotoUrl(response.data.profile_photo); // Set profile photo URL from response data
      console.log("Signup successful:", response.data);

      console.log("Photo before upload:", photo);

      console.log("Photo uploaded successfully");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.response.data.error);
      setSignupSuccess(false); // Set signup success to false if there is an error
    }
  };
  const handlePhotoChange = (event) => {
    // Update state with the selected file
    setPhoto(event.target.files[0]);

<<<<<<< Updated upstream
                <div className={classes.control}>
                        <label htmlFor="photo">Profile Photo</label>
                        <input
                            id="photo"
                            type="file" // Change input type to file
                            accept=".jpg, .jpeg, .png" // Specify accepted file types
                            onChange={handleFileInputChange} // Handle file input change
                            required
                        />
                    </div>

                
                {error && <p className={classes.error}>{error}</p>}
                {signupSuccess && <p className={classes.success}>Signup successful</p>}
                <div className ={classes.actions}>
                    <button className = {classes.signup}> Sign Up </button>
                </div>
                </form>
            </Card>
       </div>
      
    );
=======
    console.log("Photo before upload:", event.target.files[0]);
  };

  return (
    <div className={classes.SignUpContainer}>
      <h1> SIGN UP </h1>
      <Card>
        <form className={classes.form} onSubmit={handleSignup}>
          <div className={classes.control}>
            <label htmlFor="uname">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={classes.control}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={classes.control}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={classes.control}>
            <label htmlFor="pnumber">Phone Number</label>
            <input
              id="pnumber"
              type="tel"
              value={pnumber}
              onChange={(e) => setPnumber(e.target.value)}
              required
            />
          </div>

          <div className={classes.control}>
            <label htmlFor="photo">Profile Photo</label>
            <input
              id="photo"
              type="file" // Change type to "file"
              onChange={handlePhotoChange} // Add onChange event handler
              accept="image/*" // Add accept attribute to accept only image files
              required
            />
          </div>

          {/* Display error message */}
          {error && <p className={classes.error}>{error}</p>}
          {signupSuccess && !error && (
            <p className={classes.success}>Signup successful</p>
          )}
          <div className={classes.actions}>
            <button className={classes.signup}> Sign Up </button>
          </div>
        </form>
        {/* Display uploaded image if registration was successful */}
        {signupSuccess && !error && (
          <div>
            <p>Profile Photo:</p>
            <img src={require(`../images/280196402_5082234895191865_2484924407445534720_n.jpg`)} alt="Profile" />
          </div>
        )}

        {/* Error message */}
        {error && <p>{error}</p>}
      </Card>
    </div>
  );
>>>>>>> Stashed changes
}

export default SignUpPage;
