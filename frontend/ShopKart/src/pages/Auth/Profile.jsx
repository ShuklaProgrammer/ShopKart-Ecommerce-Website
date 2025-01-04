import React from "react";

import ProfileSidebar from "@/components/mycomponents/ProfileSidebar";
import ProfileSetting from "./ProfileSetting";

const Profile = () => {
  return (
    <section className="">
      <main className="flex">
        <ProfileSidebar />
        <ProfileSetting className="w-full" />
      </main>
    </section>
  );
};

export default Profile;
