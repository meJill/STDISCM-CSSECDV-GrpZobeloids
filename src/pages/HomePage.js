import DataList from "../components/actions/CharItemList"
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import React, {useState} from 'react';

const Dummy_Data =[{
    id: 'data1',
    charname: 'Dr. Ratio',
    image: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/12/dr-ratio-is-ready-to-join-the-team-in-honkai-star-rail.jpg',
    origin: 'Honkai Star Rail'
}]


function HomePage(){
    const authenticated = useAuth();
    const [profilePhotoUrl, setProfilePhotoUrl] = useState();
    const isLoggedIn = async (event) => {
        console.log(localStorage.getItem('username'))
        let username = localStorage.getItem('username')
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/loggedIn", {
                username
            });
            console.log(response.data.profile_photo.profile_photo_path)
            setProfilePhotoUrl('../'+(response.data.profile_photo.profile_photo_path).slice(4).replace("\\", "/"))
            console.log(profilePhotoUrl)
        } catch (error) {

        }
    };

    return (
    <div className = "home-page" onLoad={isLoggedIn}>
        <h1> Home </h1>
        <DataList chars ={Dummy_Data}/>
        <h1>{profilePhotoUrl}</h1>
        {authenticated && (
            <div>
                <img src={require(profilePhotoUrl)}/>
                <img src={require('../images/db38a6120e0904ad3e387d2f2b96dbd0.png')}/>

            </div>  
        )}
    </div>
    
    );
}


export default HomePage;