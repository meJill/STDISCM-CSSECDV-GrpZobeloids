import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManagePage() {
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null); // State to track the post being edited
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');

  useEffect(() => {
    // Fetch posts associated with the user_id from the backend
    const fetchPosts = async () => {
      try {
        const user_id = localStorage.getItem('user_id');
        if (!user_id) {
          throw new Error('User ID not found in local storage');
        }
        
        // Make sure to specify the full URL of your backend server
        const response = await axios.get(`http://localhost:5000/api/posts/${user_id}`);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
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
    setEditedTitle(''); // Reset the edited title
    setEditedBody(''); // Reset the edited body
  };

  const handleSaveEdit = async () => {
    try {
      // Make a request to update the post with the specified ID
      const response = await axios.put(`http://localhost:5000/api/posts/${editPostId}`, {
        title: editedTitle,
        body: editedBody
      });
      console.log(response.data.message); // Log success message

      // Update the post in the state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.post_id === editPostId ? { ...post, title: editedTitle, body: editedBody } : post
        )
      );

      // Reset edit state
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      // Make a request to delete the post with the specified ID
      const response = await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      console.log(response.data.message); // Log success message
      // Remove the deleted post from the state
      setPosts(prevPosts => prevPosts.filter(post => post.post_id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="manage-posts-page">
      <h1>Manage Posts</h1>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.post_id} className="post">
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
                <h2>#{post.post_id} {post.title}</h2>
                <p>{post.body}</p>
                {/* Edit and Delete buttons */}
                <button onClick={() => handleEdit(post.post_id, post.title, post.body)}>Edit</button>
                <button onClick={() => handleDelete(post.post_id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagePage;