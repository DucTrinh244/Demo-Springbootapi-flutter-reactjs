import React from "react";
import { Route, Routes } from "react-router";
import App from "../App";
import AddUserPage from "../pages/AddUserPage";
import HomePage from "../pages/HomePage";
import UserListPage from "../pages/UserListPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/add-user" element={<AddUserPage/>} />
      <Route path="/list-user" element={<UserListPage/>} />
      <Route path="/home" element={<HomePage/>} />
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
