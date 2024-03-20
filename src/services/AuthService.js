import axios from "axios";
import { useState } from "react";

class AuthService {
  isAuthenticated() {
    const isLoggedIn = this.loginCheck
    if (!isLoggedIn) return false;

    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) return false;

    const now = new Date().getTime();
    return now < parseInt(expirationTime, 10);
  }

  loginCheck = async() => {
    try {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      setUsername(localStorage.getItem('username'));
      setPassword(localStorage.getItem('password'));
      const response = await axios.post("http://localhost:5000/isLogin", {
        username,
        password,
      });
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
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("user_id");
    localStorage.removeItem("expirationTime");
  }
}

export default new AuthService();
