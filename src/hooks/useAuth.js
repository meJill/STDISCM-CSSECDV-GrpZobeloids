import { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate } from "react-router-dom";

function useAuth() {
  const [authenticated, setAuthenticated] = useState(AuthService.isAuthenticated());
  const navigate = useNavigate();
  useEffect(() => {
    const intervalId = setInterval(() => {
      const expired = AuthService.isSessionExpired();
      if (expired) {
        AuthService.logout(); // Logout if session is expired
        setAuthenticated(false); // Update authentication state
        navigate('/login-page')
      } else {
        const state = AuthService.isAuthenticated()
        setAuthenticated(state);
      }
    }, 0); // Check authentication status and session expiry every second

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  return authenticated;
}

export default useAuth;