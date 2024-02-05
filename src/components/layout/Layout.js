import MainNavigationPage from "./MainNavigationPage";
import classes from "./Layout.module.css";

function Layout(props) {
  return (
    <div>
      <div className="navbar">
        {" "}
        <MainNavigationPage />{" "}
        <main className = {classes.main}>
            {props.children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
