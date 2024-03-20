import { Link } from "react-router-dom";
import useAuth from '../../hooks/useAuthWoN';
import AuthService from "../../services/AuthService";
import { useState } from "react";

import classes from "./MainNavigationPage.module.css";



function MainNavigationPage() {
  const authenticated = useAuth();

  const handleLogout = () => {
    AuthService.logout();
  };
  return (
    <header className={classes.header}>
      {authenticated && (
        <div>
          {/* <img src={require("../"+localStorage.getItem("pfp"))} /> */}
        </div>
      )}
      <div className={classes.logo}> PersonaDex </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {authenticated &&
            <li>
            <Link to="/manage-page">Manage Posts</Link>
            </li>
          }
          {authenticated &&
            <li>
              <Link to="/add-page">Add Post</Link>
            </li>
          }
          {authenticated &&
            <li>
              <Link to="/edit-user-page">Edit User Page</Link>
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

export default MainNavigationPage;
