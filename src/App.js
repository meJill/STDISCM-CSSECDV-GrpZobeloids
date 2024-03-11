import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ManagePage from "./pages/ManagePage";
import AddPage from "./pages/AddPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/layout/Layout";

import AddCharacterForm from "./components/actions/AddCharacterForm";
import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLoginPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <Layout>
      <div className="app-container">
        <Routes>
          {/* Public routes accessible to all users */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/signup-page" element={<SignUpPage />} />

          {/* User-specific routes */}
          <Route path="/manage-page" element={<ManagePage />} />
          <Route path="/add-page" element={<AddPage />} />
          <Route path="/user-page" element={<UserPage />} />
          {/* Admin-specific routes */}
          <Route path="/admin-login-page" element={<AdminLogin />} />
          <Route path="/admin-page" element={<AdminPage />} />
        </Routes>
      </div>
    </Layout>
  );
}

export default App;