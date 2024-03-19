import AddCharacterForm from "../components/actions/AddCharacterForm";

function AddPage() {
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
