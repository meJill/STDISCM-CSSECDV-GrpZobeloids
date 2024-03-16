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
        <h1>{profilePhotoUrl}</h1>
        {authenticated  &&
            <div>
                <img src={require(`../${profilePhotoUrl}`)}/>
                {/* <img src={require("../images/db38a6120e0904ad3e387d2f2b96dbd0.png")}/> */}

            </div>  
        }
    </div>
    
    );
}

export default HomePage;