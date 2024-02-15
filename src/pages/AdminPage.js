import ProfileList from "../components/actions/ProfileItemList";

const Dummy_Data =[{
    id: 'profile1',
    username: 'Test User',
    image: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/12/dr-ratio-is-ready-to-join-the-team-in-honkai-star-rail.jpg',
    email: 'testemail@gmail.com',
    phonenumber: '1234567890'
}]

function AdminPage() {
  return (
    <section className = "add-page">
    {" "}
    <div className = "AdminContainer">
        <h1> Admin </h1>
        <ProfileList chars ={Dummy_Data}/>
    </div>

    
    </section>
  );
}

export default AdminPage;
