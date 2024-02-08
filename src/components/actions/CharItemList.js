import CharItem from "./CharItem";
import classes from "./CharItemList.module.css";

function MeetupList(props) {
  return (
    <ul className={classes.list}>
      {props.chars.map((char) => (
        <CharItem
          key={char.id}
          id={char.id}
          image={char.image}
          charname={char.charname}
          origin={char.origin}
        />
      ))}
    </ul>
  );
}

export default MeetupList;
