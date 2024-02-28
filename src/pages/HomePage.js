import DataList from "../components/actions/CharItemList"
import useAuth from '../hooks/useAuth';

const Dummy_Data =[{
    id: 'data1',
    charname: 'Dr. Ratio',
    image: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/12/dr-ratio-is-ready-to-join-the-team-in-honkai-star-rail.jpg',
    origin: 'Honkai Star Rail'
}]


function HomePage(){
    const authenticated = useAuth();
    return (
    <div className = "home-page">
        <h1> Home </h1>
        <DataList chars ={Dummy_Data}/>
        {authenticated ? (
            <p>User is authenticated.</p>
            ) : (
            <p>User is not authenticated.</p>
        )}
    </div>
  
);
}


export default HomePage;