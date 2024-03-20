import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; 
import classes from "./LoginPage.module.css";
import Card from "../components/ui/Card";
import axios from "axios";
import config from "./config";
import AuthService from "../services/AuthService";

function GotoSignup() {
  return <Link to="/signup-page">Sign Up</Link>;
}

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      if (!captchaToken) {
        setError("Please complete the CAPTCHA.");
        return;
      }

      const response = await axios.post("http://localhost:5000/login", {
        
        username,
        password,
        captchaToken
        
      });
      setError("");
      console.log("Login successful:", response.data);

      const now = new Date();
      const expirationTime = now.getTime() + 1000 * 1000; // 1 hour expiry time
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("user_id", response.data.user_id); // Set user_id from response
      localStorage.setItem("expirationTime", expirationTime.toString());

      navigate("/");

      // Your login logic
    } catch (error) {
      setError("Invalid username or password");
      console.error("Login failed:", error);
    }
  };

  const navigate = useNavigate();
  const navSignUp = () => {
    navigate("/signup-page");
  };

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value); 
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
          <div className={classes.captcha}>
            <ReCAPTCHA
              sitekey={config.google_site_key}
              onChange={handleCaptchaChange}
            />
          </div>
          <div className={classes.actions}>
            <button
              type="submit"
              className={classes.login}
            >
              Login
            </button>
            <button className={classes.signup} onClick={navSignUp}>
              Register
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
