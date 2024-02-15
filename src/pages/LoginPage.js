import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha'; // Import ReCAPTCHA
import classes from './LoginPage.module.css';
import Card from '../components/ui/Card';
import axios from 'axios';
import config from '../config.js' 

function GotoSignup() {
  return <Link to="/signup-page">Sign Up</Link>;
}

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // Your login logic
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login failed:', error);
    }
  };

  const navigate = useNavigate();
  const navSignUp = () => {
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
          {/* Add ReCAPTCHA component */}
          <ReCAPTCHA sitekey= {config.google_site_key} />
          <div className={classes.actions}>
            <button className={classes.signup} onClick={navSignUp}>
              Register
            </button>
            <button type="submit" className={classes.login}>
              Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;