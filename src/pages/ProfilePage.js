import classes from "./ProfilePage.module.css";
import Card from "../components/ui/Card";

function ProfilePage(props) {
  return (<div className="ProfilePage">
        <li className={classes.item}>
        <Card>
            <div className={classes.charname}>
            <img src={props.image} alt={props.charname} />
            </div>
            <div className={classes.content}>
            <h3> {props.charname} </h3>
            <origin> {props.origin} </origin>
            </div>
        </Card>
        </li>
    </div>
  );
}

export default ProfilePage;
