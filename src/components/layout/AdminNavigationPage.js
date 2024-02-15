import { Link } from "react-router-dom";

import classes from "./MainNavigationPage.module.css";

function MainNavigationPage() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}> PersonaDex </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/manage-page">Manage</Link>
          </li>
          <li>
            <Link to="/add-page">Add</Link>
          </li>
          <li>
            <Link to="/login-page">Login</Link>
          </li>
          <li>
            <Link to="/admin-page">Admin</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigationPage;
