
import Card from '../ui/Card';
import classes from './ProfileItem.module.css';

function ProfileItem(props) {
    return <li className = {classes.item}>
        <Card>
        <div className = {classes.username}>
            <img src = {props.image} alt = {props.profilepic}/>
        </div>
        <div className = {classes.content}>
            <email> {props.email} </email>
            <phonenumber> {props.phonenumber} </phonenumber>
        </div>
        </Card>
    </li>
}

export default ProfileItem;