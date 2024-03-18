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

  return (
    <div className="manage-posts-page">
      <h1>Manage Posts</h1>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            {/* Display other post details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagePage;