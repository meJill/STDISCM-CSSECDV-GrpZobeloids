import { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

function useAuth() {
  const [authenticated, setAuthenticated] = useState(AuthService.isAuthenticated());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const expired = AuthService.isSessionExpired();
      if (expired) {
        AuthService.logout(); // Logout if session is expired
        setAuthenticated(false); // Update authentication state
      } else {
        setAuthenticated(AuthService.isAuthenticated());
      }
    }, 1000); // Check authentication status and session expiry every second

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  return authenticated;
}

export default useAuth;