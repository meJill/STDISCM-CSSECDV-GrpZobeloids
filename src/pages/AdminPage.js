import classes from "./AdminPage.module.css";
import Card from "../components/ui/Card";

function AdminPage() {
  return (
    <section className="add-page">
      {" "}
      <div className = {classes.tableContainer}>
        <div className="row">
          <div className="col">
            <div className="card-header">
              <h1> Admin </h1>
            </div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th> ID </th>
                    <th> Username </th>
                    <th> Email </th>
                    <th> Phone Number</th>
                    <th> Action</th>
                  </tr>
                </thead>
              </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;
