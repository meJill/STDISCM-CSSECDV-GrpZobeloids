import { Link } from "react-router-dom";
import useAuth from '../../hooks/useAuthWoN';
import AuthService from "../../services/AuthService";
import { useState } from "react";
import axios from "axios";

import classes from "./MainNavigationPage.module.css";



function MainNavigationPage() {
  const authenticated = useAuth();

  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const pfp = async () => {
    let username = localStorage.getItem("username");
    let password = localStorage.getItem("password")
    // console.log(username)
    // if statement here
    try {
      const response = await axios.post("InsertIPHERE:5000/getPhoto", {
        username,
        password
      });
      setProfilePhotoUrl(response.data.profile_photo);
      console.log(profilePhotoUrl)
    } catch (error) {}

    return true;
  };

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <header className={classes.header}>
      {authenticated && pfp() &&(
        <div>
          <img src={require(`../../${profilePhotoUrl}`)} className = {classes.img}/>
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
