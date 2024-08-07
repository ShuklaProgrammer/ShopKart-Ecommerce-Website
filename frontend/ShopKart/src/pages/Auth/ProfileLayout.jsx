import ProfileSidebar from '@/components/mycomponents/ProfileSidebar'
import React from 'react'

import { Outlet } from 'react-router-dom'

const ProfileLayout = () => {
  return (
    <section className='flex'>
        <ProfileSidebar/>
        <main className='w-full'>
        <Outlet/>
        </main>
    </section>
  )
}

export default ProfileLayout