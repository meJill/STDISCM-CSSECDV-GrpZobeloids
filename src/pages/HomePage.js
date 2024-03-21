import axios from "axios";
import React, { useEffect, useState } from "react";

function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch all posts from the backend
        const response = await axios.get('https://localhost:5000/api/posts');
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Function to determine MIME type based on file extension
  const getMimeType = (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'pdf':
        return 'application/pdf';
      default:
        return null; // Unknown file type
    }
  };

  return (
    <div className="home-page">
      <div className="posts-list">
        <h1>Recent Posts:</h1> {/* not sorted yet */}
        {posts.map((post) => (
          <div key={post.post_id} className="post">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            {post.file_path && (
              <div>
                <p>File:</p>
                {/* Display file based on MIME type */}
                {getMimeType(post.file_path) === 'image/jpeg' ||
                getMimeType(post.file_path) === 'image/png' ? (
                  <img src={require("../"+(post.file_path).slice(4).replace(/\\/g, "/"))} alt="File" />
                ) : getMimeType(post.file_path) === 'application/pdf' ? (
                  <embed src={require("../"+(post.file_path).slice(4).replace(/\\/g, "/"))} type="application/pdf" width="500" height="600" />
                ) : (
                  <p>Unsupported file format</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
