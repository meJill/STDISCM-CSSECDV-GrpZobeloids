// UserPage.js

import React, { useState } from 'react';
import Card from '../components/ui/Card'; // Import your Card component
import classes from './UserPage.module.css'; // Import your CSS module

function UserPage() {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(''); // Set the profile photo URL dynamically
  const [username, setUsername] = useState('username'); // Set the username dynamically
  const [email, setEmail] = useState('user@example.com'); // Set the user's email
  const [phoneNumber, setPhoneNumber] = useState('123-456-7890'); // Set the user's phone number


  const handleEdit = () => {
    // Implement your edit functionality here
    console.log('Edit button clicked');
    // You can open a modal or navigate to an edit page
  };

  const handleDelete = () => {
    // Implement your delete functionality here
    console.log('Delete button clicked');
    // You can show a confirmation dialog and perform the deletion
  };

  return (
    <div className={classes.container}>
    <Card className={classes.userCard}>
      <div className={classes.profileSection}>
        <img src={profilePhotoUrl} alt="Profile" className={classes.profilePhoto} />
        {/* Display the user's profile photo */}
      </div>
      <div className={classes.userInfo}>
        <p>Username: {username}</p>
        <p>Email: {email}</p>
        <p>Phone Number: {phoneNumber}</p>
      </div>
      <div className={classes.actions}>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </Card>
    </div>
  );
}

export default UserPage;
