import { useState } from 'react';
import classes from "./AddCharacterForm.module.css";
import Card from "../ui/Card";

function AddCharacterForm() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState('');

  const submitHandler = (event) => {
    event.preventDefault();
    
    // Here you can send a request to your backend to add the user post
    // Example:
    // fetch('/api/addUserPost', {
    //   method: 'POST',
    //   body: JSON.stringify({ title, body, file }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then(response => {
    //   // Handle response
    // });

    // For now, let's just log the values
    console.log('Title:', title);
    console.log('Body:', body);
    console.log('File:', file);
    
    // Reset the form fields
    setTitle('');
    setBody('');
    setFile('');
    
    // Hide the form after submission
    setIsFormVisible(false);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };

  return (
    <Card>
      {!isFormVisible && (
        <div className={classes.actions}>
          <button onClick={toggleFormVisibility}>Add</button>
        </div>
      )}
      {isFormVisible && (
        <form className={classes.form} onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              rows="5"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
            ></textarea>
          </div>
          <div className={classes.control}>
            <label htmlFor="file">File (Optional)</label>
            <input
              type="file"
              id="file"
              accept=".jpg, .jpeg, .png, .pdf"
              onChange={(event) => setFile(event.target.files[0])}
            />
          </div>
          <div className={classes.actions}>
            <button type="submit">Add User Post</button>
          </div>
        </form>
      )}
    </Card>
  );
}

export default AddCharacterForm;
