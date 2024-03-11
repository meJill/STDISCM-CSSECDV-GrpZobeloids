import { Link } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import AuthService from "../../services/AuthService";

import classes from "./MainNavigationPage.module.css";



function MainNavigationPage() {
  const authenticated = useAuth();
  const handleLogout = () => {
    AuthService.logout();
  };
  return (
    <header className={classes.header}>
      <div className={classes.logo}> PersonaDex </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/admin-page">Manage</Link>
          </li>
          {authenticated ? (
            <li>
              <Link onClick={handleLogout}>Logout</Link>
            </li>
            ) : (
            <li>
              <Link to="/login-page">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigationPage;
