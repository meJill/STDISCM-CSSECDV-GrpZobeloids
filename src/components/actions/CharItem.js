
import Card from '../ui/Card';
import classes from './CharItem.module.css';

function CharItem(props) {
    return <li className = {classes.item}>
        <Card>
        <div className = {classes.charname}>
            <img src = {props.image} alt = {props.charname}/>
        </div>
        <div className = {classes.content}>
            <h3> {props.charname} </h3>
            <origin> {props.origin} </origin>
        </div>
        </Card>
    </li>
}

export default CharItem;