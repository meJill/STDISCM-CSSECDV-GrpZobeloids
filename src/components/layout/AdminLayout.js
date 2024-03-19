import AdminNavigationPage from "./AdminNavigationPage";
import classes from "./Layout.module.css";

function AdminLayout(props) {
  return (
    <div>
      <div className="navbar">
        {" "}
        <AdminNavigationPage />{" "}
        <main className = {classes.main}>
            {props.children}
        </main>
      </div>
    </div>
  );
}


export default AdminLayout;
