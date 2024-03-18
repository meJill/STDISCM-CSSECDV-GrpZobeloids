import AddCharacterForm from "../components/actions/AddCharacterForm";

function AddPage() {
  return (
    <section className = "add-page">
    {" "}
    <div className = "AddContainer">
        <h1> Admin </h1>
    </div>
    <AddCharacterForm />
    
    </section>
  );
}

export default AddPage;
