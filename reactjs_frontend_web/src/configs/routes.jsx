import { Route, Routes } from "react-router-dom";

import PrivateRoute from "../components/auth/privateRoute";
import AnalyticsPage from "../pages/AnalyticsPage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignUpPage";
import AddRoomPage from "../pages/chat/AddRoomPage";
import ChatPage from "../pages/chat/ChatPage";
import MyRooms from "../pages/chat/MyRooms";
import DashboardPageLayout from "../pages/DashboardLayout";
import HomePage from "../pages/HomePage";
import OrdersPage from "../pages/OrdersPage";
import OverviewPage from "../pages/OverviewPage";
import NotFoundPage from "../pages/Page404";
import AddMemberPage from "../pages/project/AddMemberPage";
import AddProductPage from "../pages/project/AddProductPage";
import EditProjectPage from "../pages/project/EditProjectPage";
import ProductsPage from "../pages/project/ProductsPage";
import ProjectDetailPage from "../pages/project/ProjectDetailPage";
import AddFile from "../pages/projectFile/AddFile";
import UploadFileProject from "../pages/projectFile/UploadFileProject";
import ResourcePage from "../pages/resources/ResourcePage";
import SalesPage from "../pages/SalesPage";
import TaskDetailPage from "../pages/tasks/TaskDetailPage";
import TaskPage from "../pages/tasks/TaskPage";
import EditProfilePage from "../pages/user/EditProfilePage";
import SettingsPage from "../pages/user/SettingsPage";
import UsersPage from "../pages/UsersPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<DashboardPageLayout />}>
          <Route index element={<OverviewPage />} />
          {/* Projects */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="projects/:id/edit" element={<EditProjectPage />} />
          <Route path="projects/:id/detail" element={<ProjectDetailPage />} />
          <Route path="projects/:id/add_member" element={<AddMemberPage />} />
          {/* Tasks */}
          <Route path="tasks" element={<TaskPage />} />
          <Route path="tasks/add" element={<TaskPage />} />
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="tasks/:taskId/edit" element={<TaskPage />} />
          {/* Resource */}
          <Route path="resource" element={<ResourcePage />} />
          <Route path="resource/:resourceId" element={<ResourcePage />} />
          {/* Files */}
          <Route path="file/:projectId" element={<UploadFileProject />} />
          <Route path="file/:projectId/upload" element={<AddFile />} />

          <Route path="users" element={<UsersPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          {/* Chat */}
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/add-room" element={<AddRoomPage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/user/edit" element={<EditProfilePage />} />
        </Route>
      </Route>
      <Route path="room" element={<MyRooms />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
