import DataList from "../components/actions/CharItemList"
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import React, {useEffect, useState} from 'react';


const Dummy_Data =[{
    id: 'data1',
    charname: 'Dr. Ratio',
    image: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/12/dr-ratio-is-ready-to-join-the-team-in-honkai-star-rail.jpg',
    origin: 'Honkai Star Rail'
}]


function HomePage(){
    const authenticated = useAuth();
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
          try {
            // Fetch all posts from the backend
            const response = await axios.get('http://localhost:5000/api/posts');
            setPosts(response.data.posts);
          } catch (error) {
            console.error('Error fetching posts:', error);
          }
        };
    
        fetchPosts();
      }, []);


    const IsLoggedIn = async () => {
        console.log(localStorage.getItem('username'))
        let username = localStorage.getItem('username')
        try {
            const response = await axios.post("http://localhost:5000/loggedIn", {
                username
            });
            console.log(response.data.profile_photo)
            const test = response.data.profile_photo
            // const path = (require("../"+test))
            const path = (test)
            setProfilePhotoUrl(path)
            console.log(profilePhotoUrl)
        } catch (error) {

        }


        
        
        return true;
    };
    console.log(import.meta.url)
    
    // localStorage.setItem("image", profilePhotoUrl)
    // console.log(localStorage.getItem("image"))
    // let wah = import(localStorage.getItem("image"))
    
    return (
    <div className = "home-page" onLoad={IsLoggedIn}>
        <h1> Home </h1>
        <DataList chars ={Dummy_Data}/>
        {authenticated  &&
            <div>
                <img src={require(`../${profilePhotoUrl}`)}/>
                {/* <img src={require("../images/db38a6120e0904ad3e387d2f2b96dbd0.png")}/> */}

            </div>  
        }
      <div className="posts-list">
            <h1> Recent Posts: </h1> /* not sorted yet */
        {posts.map(post => (
          <div key={post.post_id} className="post">
            <h2>{post.title}</h2>
            <p>{post.post_id} || {post.body} || {post.file_path}</p>
          </div>
        ))}
      </div>
    </div>


    
    );
}

export default HomePage;