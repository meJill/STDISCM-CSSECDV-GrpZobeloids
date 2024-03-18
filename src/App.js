import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ManagePage from "./pages/ManagePage";
import AddPage from "./pages/AddPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/layout/Layout";

import AddCharacterForm from "./components/actions/AddCharacterForm";
import SignUpPage from "./pages/SignUpPage";

import AdminLoginPage from "./pages/AdminLoginPage";

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
          <Route path="/admin-login-page" element={<AdminLoginPage />} />
        </Routes>
      
      </div>
    </Layout> 
  );
}

export default App;
