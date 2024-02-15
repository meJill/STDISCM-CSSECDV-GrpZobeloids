import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import classes from './LoginPage.module.css';
import Card from '../components/ui/Card';
import React, {useState} from 'react';
import axios from 'axios';


  

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      setError('')
      console.log('Login successful:', response.data);
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login failed:', error);
    }
  };

  const navigate = useNavigate();

  const navigateToSignup = () => {
    // 👇️ navigate to /contacts
    navigate('/signup-page');
  };

  return (
    <div className={classes.LoginContainer}>
      <h1>LOGIN</h1>
      <Card>
        <form className={classes.form} onSubmit={handleLogin}>
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
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p className={classes.error}>{error}</p>}
          <div className={classes.actions}>
            <button className={classes.signup} onClick = {navigateToSignup}>Register</button>
            <button type="submit" className={classes.login}>Login</button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
