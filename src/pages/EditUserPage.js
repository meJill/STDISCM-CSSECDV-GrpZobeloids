import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classes from './EditUserPage.module.css';
import useAuth from '../hooks/useAuth';
import Card from '../components/ui/Card'

function EditUserPage() {
  const authenticated = useAuth();
  const [user, setUser] = useState(null);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhoneNo, setEditedPhoneNo] = useState('');

  useEffect(() => {
    // Fetch user data based on user_id from local storage
    const fetchUser = async () => {
      try {
        const user_id = localStorage.getItem('user_id');
        if (!user_id) {
          throw new Error('User ID not found in local storage');
        }
        const response = await axios.get(`http://localhost:5000/api/users/${user_id}`);
        const userData = response.data.user[0];
        setUser(userData);
        setEditedUsername(userData.username || '');
        setEditedEmail(userData.email || '');
        setEditedPhoneNo(userData.phone_no || '');
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${user.user_id}`, {
        username: editedUsername,
        email: editedEmail,
        phone_no: editedPhoneNo
      });
      console.log(response.data.message); // Log success message
      // Update user state with edited values
      const updatedUser = { ...user, username: editedUsername, email: editedEmail, phone_no: editedPhoneNo };
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  return (
    
    <div>
      <h1>Edit User</h1>
      <Card>
      {user && (
        <div className={classes.container}>
          <div className={classes.control}>
            <label>Edit Username:</label>
            <input
              type="text"
              value={editedUsername}
              onChange={(event) => setEditedUsername(event.target.value)}
            />
          </div>
          <div className={classes.control}>
            <label>Edit Email:</label>
            <input
              type="email"
              value={editedEmail}
              onChange={(event) => setEditedEmail(event.target.value)}
            />
          </div>
          <div className = {classes.control}>
            <label>Edit Phone Number:</label>
            <input
              type="text"
              value={editedPhoneNo}
              onChange={(event) => setEditedPhoneNo(event.target.value)}
            />
          </div>
          <div className = {classes.actions}>
          <button onClick={handleSaveEdit} className={classes.update}>Save</button>
          </div>
        </div>
      )}
      </Card>
    </div>
    
  );
}

export default EditUserPage;
