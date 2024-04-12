import { useState } from 'react';
import classes from "./AddCharacterForm.module.css";
import Card from "../ui/Card";
import ButtonCard from "../ui/ButtonCard";
import axios from 'axios';
import config from "../../config";

function AddCharacterForm() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();
  
    try {
      // Retrieve user_id from local storage
      const user_id = localStorage.getItem('user_id');
  
      // Check if user_id is available
      if (!user_id) {
        throw new Error('User ID not found in local storage');
      }

      console.log(title);
      console.log(body);
      console.log(user_id);
      console.log(file);


      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      formData.append('user_id', user_id); // Add user_id to form data
  
      if (file) {
        formData.append('file', file);
      }
      let username = localStorage.getItem('username')
      if ((/^[a-m]/).test(username[0].toLowerCase())) {
        const response = await axios.post(`https://${config.fip}:5000/api/addUserPost`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Set proper headers for FormData
          }
        });
      } else {
        const response = await axios.post(`https://${config.dip}:5000/api/addUserPost`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Set proper headers for FormData
          }
        });
      }
  
  
      // Reset the form fields
      setTitle('');
      setBody('');
      setFile('');
    } catch (error) {
      console.error('Error adding user post:', error.message);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };

  return (
    <ButtonCard>
      {!isFormVisible && (
        <div className={classes.toggle}>
          <button onClick={toggleFormVisibility}>Add</button>
        </div>
      )}
      {isFormVisible && (
        <Card>
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
        </Card>
      )}
    </ButtonCard>
  );
}

export default AddCharacterForm;
