import ProfileItem from "./ProfileItem";
import classes from "./ProfileItemList.module.css";

function ProfileList(props) {
  return (
    <ul className={classes.list}>
      {props.profiles.map((profile) => (
        <ProfileItem
          key={profile.id}
          id={profile.id}
          image={profile.image}
          username={profile.username}
          email={profile.email}
          phonenumber={profile.phonenumber}
        />
      ))}
    </ul>
  );
}

export default ProfileList;
