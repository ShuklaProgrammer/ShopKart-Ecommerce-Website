import ProfileSidebar from "@/components/mycomponents/ProfileSidebar";
import React from "react";

import { Outlet, useLocation } from "react-router-dom";

const ProfileLayout = () => {
  const location = useLocation();

  const pages =
    location.pathname.includes("/profile/dashboard") ||
    location.pathname.includes("/profile/orders") ||
    location.pathname.includes("/profile/address") ||
    location.pathname.includes("/profile/setting") ||
    location.pathname.includes("/profile/order-details");
  return (
    <section className="flex">
      <div className={`${pages ? "hidden sm:block" : "block"}`}>
        <ProfileSidebar />
      </div>
      <main className="w-full">
        <Outlet />
      </main>
    </section>
  );
};

export default ProfileLayout;
