import classes from './Card.module.css'

function ButtonCard(props){
    return <div className = {classes.card}>
        {props.children}
    </div>;
}

export default ButtonCard;