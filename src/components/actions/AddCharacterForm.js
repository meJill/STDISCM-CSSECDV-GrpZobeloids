import classes from "./AddCharacterForm.module.css";
import Card from "../ui/Card";

function AddCharacterForm() {
  return (
    <Card>
      <form className={classes.form}>
        <div className={classes.control}>
          <label htmlFor="name">Character Name</label>
          <input type="text" required id="name" />
        </div>
        <div className={classes.control}>
          <label htmlFor="origin">Character Origin</label>
          <input type="text" required id="origin" />
        </div>
        <div className={classes.control}>
          <label htmlFor="image">Character Image</label>
          <input type="url" required id="image" />
        </div>
        <div className ={classes.actions}>
            <button> Add Character </button>
        </div>
      </form>
    </Card>
  );
}

export default AddCharacterForm;
