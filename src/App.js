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

function App() {
  return (
    <Layout>
    
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/manage-page" element={<ManagePage />} />
          <Route path="/add-page" element={<AddPage />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/signup-page" element={<SignUpPage />} />
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/admin-page" element={<Admin />} />
          <Route path="/admin-login-page" element={<AdminLoginPage />} />
          <Route path="/admin-manage-page" element={<AdminManagePage />} />
          <Route path="/admin-user-page" element={<AdminUserPage />} />
        </Routes>
      
      </div>
    </Layout> 
  );
}

export default App;
