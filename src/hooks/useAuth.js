import { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

function useAuth() {
  const [authenticated, setAuthenticated] = useState(AuthService.isAuthenticated());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAuthenticated(AuthService.isAuthenticated());
    }, 1000); // Check authentication status every second

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  return authenticated;
}

export default useAuth;