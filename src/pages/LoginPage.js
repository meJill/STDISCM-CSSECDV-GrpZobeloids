import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; 
import classes from "./LoginPage.module.css";
import Card from "../components/ui/Card";
import axios from "axios";
import config from "../config";

function GotoSignup() {
  return <Link to="/signup-page">Sign Up</Link>;
}

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const [captchaToken, setCaptchaToken] = useState('');


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // if (!captchaToken) {
      //   setError("Please complete the CAPTCHA.");
      //   return;
      // }
      const now = new Date();
      const expirationTime = now.getTime() + 500 * 1000; // 1 hour expiry time
      if ((/^[a-m]/).test(username[0].toLowerCase())) {
        const response = await axios.post(`https://${config.fip}:5000/login`, {
          username,
          password

          
          // captchaToken
      
        });
        localStorage.setItem("pfp", response.data.profile_photo.slice(4).replace("\\", "/"))
        localStorage.setItem("username", username);
        localStorage.setItem("password", password)
        localStorage.setItem("user_id", response.data.user_id); // Set user_id from response
        localStorage.setItem("expirationTime", expirationTime.toString());
      } else {
        const response = await axios.post(`https://${config.dip}:5000/login`, {
          username,
          password
          // captchaToken
      
        });
        localStorage.setItem("pfp", response.data.profile_photo.slice(4).replace("\\", "/"))
        localStorage.setItem("username", username);
        localStorage.setItem("password", password)
        localStorage.setItem("user_id", response.data.user_id); // Set user_id from response
        localStorage.setItem("expirationTime", expirationTime.toString());
      }
      // setError("");
      // console.log("Login successful:", response);

      navigate("/");

      // Your login logic
    } catch (error) {
      setError(`${error}`);
    }
  };

  const navigate = useNavigate();
  const navSignUp = () => {
    navigate("/signup-page");
  };

  // const handleCaptchaChange = (value) => {
  //   setCaptchaToken(value); 
  // };

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
