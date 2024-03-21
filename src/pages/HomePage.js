import DataList from "../components/actions/CharItemList";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Dummy_Data = [
  {
    id: "data1",
    charname: "Dr. Ratio",
    image:
      "https://static1.srcdn.com/wordpress/wp-content/uploads/2023/12/dr-ratio-is-ready-to-join-the-team-in-honkai-star-rail.jpg",
    origin: "Honkai Star Rail",
  },
];

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
    return (
    <div className = "home-page">
      <div className="posts-list">
        <h1> Recent Posts: </h1> /* not sorted yet */
        {posts.map((post) => (
          <div key={post.post_id} className="post">
            <h2>{post.title}</h2>
            <p>
              {post.post_id} || {post.body} || {post.file_path}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
