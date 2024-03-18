import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha'; // Import ReCAPTCHA
import classes from './LoginPage.module.css';
import Card from '../components/ui/Card';
import axios from 'axios';
import config from '../config';
import AuthService from '../services/AuthService';

function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  //const [captchaCompleted, setCaptchaCompleted] = useState(false);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    try {
      /*if (!captchaCompleted) {
        setError('Please complete the CAPTCHA.');
        return;
      }*/
      const response = await axios.post("http://localhost:5000/admin-login-page", {
        username,
        password,
      });
      setError("");
      console.log("Admin Login successful:", response.data);
      
      const now = new Date();
      const expirationTime = now.getTime() + 1000 * 1000; // 1 hour expiry time
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      localStorage.setItem('admin_id', response.data.admin_id); // Set admin_id from response
      localStorage.setItem('expirationTime', expirationTime.toString());

      navigate('/admin-page');


      // Your login logic
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login failed:', error);
    }
  };

  const navigate = useNavigate();

  /*const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaCompleted(true);
    }
  };*/

  return (
    <div className={classes.LoginContainer}>
      <h1>ADMIN LOGIN</h1>
      <Card>
        <form className={classes.form} onSubmit={handleAdminLogin}>
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
          {/*<div className = {classes.captcha}>
          <ReCAPTCHA sitekey={config.google_site_key} onChange={handleCaptchaChange} />
          </div>*/}
          <div className={classes.actions}>
            <button type="submit" className={classes.login} /*disabled={!captchaCompleted}*/>
              Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AdminLoginPage;