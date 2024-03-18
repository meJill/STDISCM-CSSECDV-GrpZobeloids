import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectAdminId, setSelectAdminId] = useState(null); // State to track the user being selected
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // State to track user deletion confirmation
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null); // State to track user ID for which confirmation is shown

  useEffect(() => {
    // Fetch users associated with the admin_id from the backend
    const fetchUsers = async () => {
      try {
        const admin_id = localStorage.getItem('admin_id');
        if (!admin_id) {
          throw new Error('Admin ID not found in local storage');
        }
        
        // Make sure to specify the full URL of your backend server
        const response = await axios.get(`http://localhost:5000/api/users/${admin_id}`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (adminId, username, email) => {
    setSelectAdminId(adminId); // Set the user ID being edited
    setSelectedUsername(username); // Set the initial value of edited username
    setSelectedEmail(email); // Set the initial value of edited email
  };

  const handleCancelEdit = () => {
    setSelectAdminId(null); // Reset the edit user ID
    setSelectedUsername(''); // Reset the edited username
    setSelectedEmail(''); // Reset the edited email
  };

  const handleSaveEdit = async () => {
    try {
      // Make a request to update the user with the specified ID
      const response = await axios.put(`http://localhost:5000/api/users/${selectAdminId}`, {
        username: selectedUsername,
        email: selectedEmail
      });
      console.log(response.data.message); // Log success message

      // Update the user in the state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.admin_id === selectAdminId ? { ...user, username: selectedUsername, email: selectedEmail } : user
        )
      );

      // Reset edit state
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const confirmDelete = (adminId) => {
    setDeleteConfirmationId(adminId); // Set the adminId for which deletion confirmation is needed
    setDeleteConfirmation(true); // Show the confirmation dialog
  };

  const cancelDelete = () => {
    setDeleteConfirmationId(null); // Clear the adminId for deletion confirmation
    setDeleteConfirmation(false); // Hide the confirmation dialog
  };

  const handleDelete = async (adminId) => {
    if (deleteConfirmationId === adminId) {
      try {
        // Make a request to delete the user with the specified ID
        const response = await axios.delete(`http://localhost:5000/api/users/${adminId}`);
        console.log(response.data.message); // Log success message
        // Remove the deleted user from the state
        setUsers(prevUsers => prevUsers.filter(user => user.admin_id !== adminId));
        setDeleteConfirmationId(null); // Clear the adminId for deletion confirmation
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
          <div key={user.admin_id} className="user">
            {selectAdminId === user.admin_id ? ( // If user is being edited, show edit form
              <div>
                <input
                  type="text"
                  value={selectedUsername}
                  onChange={(event) => setSelectedUsername(event.target.value)}
                />
                <textarea
                  rows="5"
                  value={selectedEmail}
                  onChange={(event) => setSelectedEmail(event.target.value)}
                ></textarea>
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>#{user.admin_id} {user.username}</h2>
                <p>{user.email}</p>
                {/* Edit and Delete buttons */}
                <button onClick={() => handleEdit(user.admin_id, user.username, user.email)}>Edit</button>
                <button onClick={() => confirmDelete(user.admin_id)}>Delete</button>
                {/* Delete confirmation dialog */}
                {deleteConfirmation && deleteConfirmationId === user.admin_id && (
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
