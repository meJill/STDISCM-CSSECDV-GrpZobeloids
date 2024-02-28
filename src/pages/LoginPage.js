import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha'; // Import ReCAPTCHA
import classes from './LoginPage.module.css';
import Card from '../components/ui/Card';
import axios from 'axios';
import config from '../config';
import AuthService from '../services/AuthService';

function GotoSignup() {
  return <Link to="/signup-page">Sign Up</Link>;
}

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaCompleted, setCaptchaCompleted] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      if (!captchaCompleted) {
        setError('Please complete the CAPTCHA.');
        return;
      }
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      setError("");
      console.log("Login successful:", response.data);
      
      const now = new Date();
      const expirationTime = now.getTime() + 10 * 1000; // 1 hour expiry time
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      localStorage.setItem('expirationTime', expirationTime.toString());


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

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaCompleted(true);
    }
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
          <div className = {classes.captcha}>
          <ReCAPTCHA sitekey={config.google_site_key} onChange={handleCaptchaChange} />
          </div>
          <div className={classes.actions}>
            <button className={classes.signup} onClick={navSignUp}>
              Register
            </button>
            <button type="submit" className={classes.login} disabled={!captchaCompleted}>
              Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;