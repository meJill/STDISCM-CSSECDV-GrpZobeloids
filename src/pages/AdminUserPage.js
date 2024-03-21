import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "./ModulePage.module.css";
import useAuth from '../hooks/useAuthA';

function AdminUserPage() {
  const authenticated = useAuth();
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null); // State to track the post being edited
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // State to track post deletion confirmation
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null); // State to track post ID for which confirmation is shown

  useEffect(() => {
    // Fetch posts associated with the user_id from the backend
    const fetchPosts = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          throw new Error("User ID not found in local storage");
        }

        // Make sure to specify the full URL of your backend server
        const response = await axios.get(
          `https://localhost:5000/api/posts/${user_id}`
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (postId, title, body) => {
    setEditPostId(postId); // Set the post ID being edited
    setEditedTitle(title); // Set the initial value of edited title
    setEditedBody(body); // Set the initial value of edited body
  };

  const handleCancelEdit = () => {
    setEditPostId(null); // Reset the edit post ID
    setEditedTitle(""); // Reset the edited title
    setEditedBody(""); // Reset the edited body
  };

  const handleSaveEdit = async () => {
    try {
      // Make a request to update the post with the specified ID
      const response = await axios.put(
        `https://localhost:5000/api/posts/${editPostId}`,
        {
          title: editedTitle,
          body: editedBody,
        }
      );
      console.log(response.data.message); // Log success message

      // Update the post in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === editPostId
            ? { ...post, title: editedTitle, body: editedBody }
            : post
        )
      );

      // Reset edit state
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const confirmDelete = (postId) => {
    setDeleteConfirmationId(postId); // Set the postId for which deletion confirmation is needed
    setDeleteConfirmation(true); // Show the confirmation dialog
  };

  const cancelDelete = () => {
    setDeleteConfirmationId(null); // Clear the postId for deletion confirmation
    setDeleteConfirmation(false); // Hide the confirmation dialog
  };

  const handleDelete = async (postId) => {
    if (deleteConfirmationId === postId) {
      try {
        // Make a request to delete the post with the specified ID
        const response = await axios.delete(
          `https://localhost:5000/api/posts/${postId}`
        );
        console.log(response.data.message); // Log success message
        // Remove the deleted post from the state
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.post_id !== postId)
        );
        setDeleteConfirmationId(null); // Clear the postId for deletion confirmation
        setDeleteConfirmation(false); // Hide the confirmation dialog
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="manage-posts-page">
      <h1>Manage Posts</h1>

      <div className={classes.posts_name}>
        {posts.map((post) => (
          <div key={post.post_id} className={classes.post}>
            {editPostId === post.post_id ? ( // If post is being edited, show edit form
              <div>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(event) => setEditedTitle(event.target.value)}
                />
                <textarea
                  rows="5"
                  value={editedBody}
                  onChange={(event) => setEditedBody(event.target.value)}
                ></textarea>
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>
                  #{post.post_id} {post.title}
                </h2>
                <p>{post.body}</p>
                {/* Edit and Delete buttons */}
                <button
                  onClick={() =>
                    handleEdit(post.post_id, post.title, post.body)
                  }
                >
                  Edit
                </button>
                <button onClick={() => confirmDelete(post.post_id)}>
                  Delete
                </button>
                {/* Delete confirmation dialog */}
                {deleteConfirmation &&
                  deleteConfirmationId === post.post_id && (
                    <div className="delete-confirmation">
                      <p>Are you sure you want to delete this post?</p>
                      <button
                        onClick={() => handleDelete(deleteConfirmationId)}
                      >
                        Yes
                      </button>
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

export default AdminUserPage;
