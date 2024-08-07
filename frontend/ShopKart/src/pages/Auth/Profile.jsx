import React from 'react'

import ProfileSidebar from '@/components/mycomponents/ProfileSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProfileSetting from './ProfileSetting';
import ProfileDashboard from './ProfileDashboard';

const Profile = () => {
  return (
    <section className=''>
      <main className='flex'>
        <ProfileSidebar/>
        <ProfileSetting className="w-full"/>
        {/* <ProfileDashboard className="w-full"/> */}
      </main>
    </section>
  )
}

export default Profile