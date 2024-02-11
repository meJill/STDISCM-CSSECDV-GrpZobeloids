import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import classes from './LoginPage.module.css';
import Card from '../components/ui/Card';

function GotoSignup() {
  return (
    <Link to="/signup-page">Sign Up</Link>
  );
}

function LoginPage() {
  return (
    <div className={classes.LoginContainer}>
      <h1>Login</h1>
      <Card>
        <form className={classes.form}>
          <div className={classes.control}>
            <label htmlFor="uname">Username</label>
            <input type="text" required id="uname" />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Password</label>
            <input type="password" required id="password" />
          </div>
          <div className={classes.actions}>
          <button className={classes.signup}>
            <GotoSignup /> </button>
            <button className={classes.login}>Login</button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
