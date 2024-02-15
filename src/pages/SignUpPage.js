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

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/register', { username, password, email, pnumber, photo });
          setError('')
          console.log('Signup successful:', response.data);
        } catch (error) {
          setError('Invalid');
          console.error('Signup failed:', error);
        }
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
                    <input id="photo" 
                        type="url"
                        value={photo} 
                        onChange={(e) => setPhoto(e.target.value)} 
                        
                    />
                </div>

                
                {error && <p className={classes.error}>{error}</p>}
                <div className ={classes.actions}>
                    <button className = {classes.signup}> Sign Up </button>
                </div>
                </form>
            </Card>
       </div>
      
    );
}


export default SignUpPage;