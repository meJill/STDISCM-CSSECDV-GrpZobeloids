import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuthA';

function AdminManageUsers() {
  const authenticated = useAuth();
  const [users, setUsers] = useState([]);
  const [selectUserId, setSelectUserId] = useState(null); // State to track the user being selected
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // State to track user deletion confirmation
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null); // State to track user ID for which confirmation is shown

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users from the backend
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId, username, email) => {
    setSelectUserId(userId); // Set the user ID being edited
    setSelectedUsername(username); // Set the initial value of edited username
    setSelectedEmail(email); // Set the initial value of edited email
  };

  const handleCancelEdit = () => {
    setSelectUserId(null); // Reset the edit user ID
    setSelectedUsername(''); // Reset the edited username
    setSelectedEmail(''); // Reset the edited email
  };

  const handleSaveEdit = async () => {
    try {
      // Make a request to update the user with the specified ID
      const response = await axios.put(`http://localhost:5000/api/edit/users/${selectUserId}`, {
        username: selectedUsername,
        email: selectedEmail
      });
      console.log(response.data.message); // Log success message

      // Update the user in the state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.user_id === selectUserId ? { ...user, username: selectedUsername, email: selectedEmail } : user
        )
      );

      // Reset edit state
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const confirmDelete = (userId) => {
    setDeleteConfirmationId(userId); // Set the userId for which deletion confirmation is needed
    setDeleteConfirmation(true); // Show the confirmation dialog
  };

  const cancelDelete = () => {
    setDeleteConfirmationId(null); // Clear the userId for deletion confirmation
    setDeleteConfirmation(false); // Hide the confirmation dialog
  };

  const handleDelete = async (userId) => {
    if (deleteConfirmationId === userId) {
      try {
        // Make a request to delete the user with the specified ID
        const response = await axios.put(`http://localhost:5000/api/users/delete/${userId}`);
        console.log(response.data.message); // Log success message
        // Remove the deleted user from the state
        setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        setDeleteConfirmationId(null); // Clear the userId for deletion confirmation
        setDeleteConfirmation(false); // Hide the confirmation dialog
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="manage-users-page">
      <h1>Manage Users</h1>
      <div className="users-list">
        {users.map(user => (
          <div key={user.user_id} className="user">
            {selectUserId === user.user_id ? ( // If user is being edited, show edit form
              <div>
                <input
                  type="text"
                  value={selectedUsername}
                  onChange={(event) => setSelectedUsername(event.target.value)}
                />
                <input
                  type="text"
                  value={selectedEmail}
                  onChange={(event) => setSelectedEmail(event.target.value)}
                ></input>
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>#{user.user_id} {user.username}</h2>
                <p>{user.email}</p>
                {/* Edit and Delete buttons */}
                <button onClick={() => handleEdit(user.user_id, user.username, user.email)}>Edit</button>
                <button onClick={() => confirmDelete(user.user_id)}>Delete</button>
                {/* Delete confirmation dialog */}
                {deleteConfirmation && deleteConfirmationId === user.user_id && (
                  <div className="delete-confirmation">
                    <p>Are you sure you want to delete this user?</p>
                    <button onClick={() => handleDelete(deleteConfirmationId)}>Yes</button>
                    <button onClick={cancelDelete}>No</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminManageUsers;
