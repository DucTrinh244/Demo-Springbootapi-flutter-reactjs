import React from "react";
import { Route, Routes } from "react-router";
import App from "../App";
import AddUserPage from "../pages/AddUserPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import HomePage from "../pages/HomePage";
import OrdersPage from "../pages/OrdersPage";
import OverviewPage from "../pages/OverviewPage";
import ProductsPage from "../pages/ProductsPage";
import SalesPage from "../pages/SalesPage";
import SettingsPage from "../pages/SettingsPage";
import UserListPage from "../pages/UserListPage";
import UsersPage from "../pages/UsersPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/add-user" element={<AddUserPage/>} />
      <Route path="/list-user" element={<UserListPage/>} />
      <Route path="/home" element={<HomePage/>} />
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
      <Route path='/' element={<OverviewPage />} />
      <Route path='/products' element={<ProductsPage />} />
      <Route path='/users' element={<UsersPage />} />
      <Route path='/sales' element={<SalesPage />} />
      <Route path='/orders' element={<OrdersPage />} />
      <Route path='/analytics' element={<AnalyticsPage />} />
      <Route path='/settings' element={<SettingsPage />} />
    </Routes>
  );
};

export default AppRoutes;
