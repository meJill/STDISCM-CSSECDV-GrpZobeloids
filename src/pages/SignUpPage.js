import classes from "./SignUpPage.module.css";
import Card from "../components/ui/Card";
import React, {useState} from 'react';
import axios from 'axios';

function SignUpPage() {
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

    return(
      
        <div className = {classes.SignUpContainer}>
            <h1> SIGN UP </h1>
            <Card>
            <form className={classes.form} onSubmit={handleSignup}>
                <div className={classes.control}>
                    <label htmlFor="uname">Username</label>
                    <input type="text" 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                
                <div className={classes.control}>
                    <label htmlFor="password">Password</label>
                    <input id="password" 
                        type="password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <div className={classes.control}>
                    <label htmlFor="email">Email</label>
                    <input id="email" 
                        type="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>

                <div className={classes.control}>
                    <label htmlFor="pnumber">Phone Number</label>
                    <input id="pnumber" 
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
}


export default SignUpPage;