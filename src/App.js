import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ManagePage from "./pages/ManagePage";
import AddPage from "./pages/AddPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/layout/Layout";
import Admin from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AddCharacterForm from "./components/actions/AddCharacterForm";
import SignUpPage from "./pages/SignUpPage";
import AdminManagePage from "./pages/AdminManagePage";
import AdminUserPage from "./pages/AdminUserPage";
import ProfilePage from "./pages/ProfilePage";

import AdminLayout from "./components/layout/AdminLayout";
import AdminPage from "./pages/AdminPage";
import AdminManagePost from "./pages/AdminManagePost";
import AdminManageUsers from "./pages/AdminManageUsers";
import EditUserPage from "./pages/EditUserPage";

function App() {
  return (
      <div className="app-container">
        <Routes>
          <Route path="/" element={(<Layout><HomePage /></Layout>)} />
          <Route path="/manage-page" element={(<Layout><ManagePage /></Layout>)} />
          <Route path="/add-page" element={(<Layout><AddPage /></Layout>)} />
          <Route path="/login-page" element={(<Layout><LoginPage /></Layout>)} />
          <Route path="/signup-page" element={(<Layout><SignUpPage /></Layout>)} />
          <Route path="/edit-user-page" element={(<Layout><EditUserPage /></Layout>)} />
          
          <Route path="/admin-login-page" element={(<AdminLayout><AdminLoginPage /></AdminLayout>)} />
          <Route path="/admin-page" element={(<AdminLayout><AdminPage /></AdminLayout>)} />
          <Route path="/admin-manage-post" element={(<AdminLayout><AdminManagePost /></AdminLayout>)} />
          <Route path="/admin-manage-users" element={(<AdminLayout><AdminManageUsers /></AdminLayout>)} />
        </Routes>
      
      </div>
  );
}

export default App;
