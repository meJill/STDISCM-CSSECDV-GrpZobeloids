import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManagePage() {
  const [posts, setPosts] = useState([]);

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

  const handleEdit = (postId) => {
    console.log(`Editing post with ID: ${postId}`);
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
            <h2>{post.title}</h2>
            <p>{post.post_id} || {post.body} || {post.file_path}</p>
            {/* Edit and Delete buttons */}
            <button onClick={() => handleEdit(post.post_id)}>Edit</button>
            <button onClick={() => handleDelete(post.post_id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagePage;
