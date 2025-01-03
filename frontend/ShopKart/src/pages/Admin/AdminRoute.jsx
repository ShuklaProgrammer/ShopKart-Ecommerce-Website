import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <>
      {userInfo && userInfo.role === "admin" ? (
        <main className="flex my-10">
          <AdminSidebar />
          <Outlet />
        </main>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default AdminRoute;
