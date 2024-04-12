import axios from "axios";
import { useState } from "react";
import config from "../config";

class AuthService {
  isAuthenticated() {
    const isLoggedIn = this.loginCheck
    if (!isLoggedIn) return false;

    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) return false;

    const now = new Date().getTime();
    return now < parseInt(expirationTime, 10);
  }

  isAuthenticatedA() {
    const isLoggedIn = this.loginCheckA
    if (!isLoggedIn) return false;

    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) return false;

    const now = new Date().getTime();
    return now < parseInt(expirationTime, 10);
  }

  loginCheckA = async() => {
    try {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      setUsername(localStorage.getItem('username'));
      setPassword(localStorage.getItem('password'));
      if ((/^[a-m]/).test(username[0].toLowerCase())) {
        const response = await axios.post(`https://${config.fip}:5000/isLoginA`, {
          username,
          password,
        });
      } else {
        const response = await axios.post(`https://${config.dip}:5000/isLoginA`, {
          username,
          password,
        });
      }
      return true
    } catch (error) {
      return false;
    }
  }

  loginCheck = async() => {
    try {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      setUsername(localStorage.getItem('username'));
      setPassword(localStorage.getItem('password'));
      if ((/^[a-m]/).test(username[0].toLowerCase())) {
        const response = await axios.post(`https://${config.fip}:5000/isLogin`, {
          username,
          password,
        });
      } else {
        const response = await axios.post(`https://${config.dip}:5000/isLogin`, {
          username,
          password,
        });
      }
      return true
    } catch (error) {
      return false;
    }
  }

  isSessionExpired() {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) return true;

    const now = new Date().getTime();
    return now >= parseInt(expirationTime, 10);
  }

  // Method to handle logout
  logout() {
    // Perform logout logic (if necessary)
    // Clear session information from localStorage
    localStorage.clear()
  }
}

export default new AuthService();
