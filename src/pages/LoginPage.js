import classes from "./LoginPage.module.css";
import Card from "../components/ui/Card";
function LoginPage() {
    return(
      
        <div className = {classes.LoginContainer}>
            <h1> LOGIN </h1>
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
                <div className ={classes.actions}>
                    <button> Login </button>
                </div>
                </form>
            </Card>
       </div>
      
    );
}


export default LoginPage;