import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // Import ReCAPTCHA
import classes from "./AdminLoginPage.module.css";
import Card from "../components/ui/Card";
import axios from "axios";
import config from "../config";

function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      if (!captchaToken) {
        setError("Please complete the CAPTCHA.");
        return;
      }
      const response = await axios.post("https://localhost:5000/loginA", {
        username,
        password,
        captchaToken
      });
      setError("");
      console.log("Login successful:", response.data);

      const now = new Date();
      const expirationTime = now.getTime() + 1000 * 1000; // 1 hour expiry time
      localStorage.setItem("username", username);
      localStorage.setItem("password", password)
      localStorage.setItem("user_id", response.data.user_id); // Set user_id from response
      localStorage.setItem("expirationTime", expirationTime.toString());
      navigate("/admin-manage-post");

      // Your login logic
    } catch (error) {
      setError("Invalid username or password");
      console.error("Login failed:", error);
    }
  };

  const navigate = useNavigate();

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaToken(value); 
    }
  };

  return (
    <div className={classes.LoginContainer}>
      <h1>LOGIN</h1>
      <Card>
        <form className={classes.form} onSubmit={handleLogin}>
          <div className={classes.control}>
            <label htmlFor="uname">Admin Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Admin Password</label>
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
            <button type="submit" className={classes.login}>
              {" "}
              Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AdminLoginPage;
