import classes from "./SignUpPage.module.css";
import Card from "../components/ui/Card";
function SignUpPage() {
    return(
      
        <div className = {classes.SignUpContainer}>
            <h1> SIGN UP </h1>
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

                <div className={classes.control}>
                    <label htmlFor="email">Email</label>
                    <input type="email" required id="email" />
                </div>

                <div className={classes.control}>
                    <label htmlFor="pnumber">Phone Number</label>
                    <input type="tel" required id="pnumber" />
                </div>

                <div className={classes.control}>
                    <label htmlFor="photo">Profile Photo</label>
                    <input type="file" required id="photo" />
                </div>

                <div className ={classes.actions}>
                    <button className = {classes.signup}> Sign Up </button>
                    
                
                </div>
                </form>
            </Card>
       </div>
      
    );
}


export default SignUpPage;