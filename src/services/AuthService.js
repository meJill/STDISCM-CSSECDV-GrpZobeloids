class AuthService {
    isAuthenticated() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) return false;
        
        const expirationTime = localStorage.getItem('expirationTime');
        if (!expirationTime) return false;
    
        const now = new Date().getTime();
        return now < parseInt(expirationTime, 10);
      }
    
      // Method to get username from session
      getUsername() {
        return localStorage.getItem('username');
      }
    
      // Method to handle logout
      logout() {
        // Perform logout logic (if necessary)
        // Clear session information from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('expirationTime');
      }
    }
  
  export default new AuthService();