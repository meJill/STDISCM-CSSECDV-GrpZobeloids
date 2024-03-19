import { Link } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import AuthService from "../../services/AuthService";

import classes from "./MainNavigationPage.module.css";



function AdminNavigationPage() {
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
            <Link to="/admin-page">Home</Link>
          </li>
          {authenticated &&
            <li>
            <Link to="/admin-manage-post">Manage Posts</Link>
            </li>
          }
          {authenticated &&
            <li>
              <Link to="/admin-manage-users">Manage Users</Link>
            </li>
          }
          {authenticated ? (
            <li>
              <Link to="/login-page" onClick={handleLogout}>Logout</Link>
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

export default AdminNavigationPage;
