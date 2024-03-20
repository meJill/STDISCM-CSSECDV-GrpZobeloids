import AddCharacterForm from "../components/actions/AddCharacterForm";
import useAuth from '../hooks/useAuth';

function AddPage() {
  const authenticated = useAuth();
  return (
    <section className="add-posts-page">
      {" "}
      <div className="AddContainer">
        <h1> Add Post</h1>
      </div>
      <AddCharacterForm />
    </section>
  );
}

export default AddPage;
