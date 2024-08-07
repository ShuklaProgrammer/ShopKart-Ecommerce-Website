import React, { useEffect, useState } from 'react'

import ProfileSidebar from '@/components/mycomponents/ProfileSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { useCreateProfileMutation, useGetUserProfileQuery, useUpdateProfileMutation } from '@/redux/api/profileApiSlice';

const ProfileSetting = () => {

  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [secondaryEmail, setSecondaryEmail] = useState("")
  const [email, setEmail] = useState("")
  const [contactNumber, setContactNumber] = useState("")

  const {userInfo} = useSelector((state) => state.auth)
  // console.log(userInfo)
  
  const {data: profileData} = useGetUserProfileQuery({userId: userInfo._id})
  console.log(profileData)
  
  const [createProfile] = useCreateProfileMutation()
  const [updateProfile] = useUpdateProfileMutation()

  useEffect(()=>{
    if(profileData && profileData.data._id){
      setFirstName(profileData.data.firstName)
      setLastName(profileData.data.lastName)
      setSecondaryEmail(profileData.data.secondaryEmail)
      setContactNumber(profileData.data.contactNumber)
      setUsername(userInfo.username)
      setEmail(userInfo.email)
    }
  }, [profileData])

  const handleCreateProfile = async(e, userId) => {
    e.preventDefault()
    try {
      const profileData = new FormData()
      profileData.append("userId", userId)
      if(firstName){
        profileData.append("firstName", firstName)
      }
      if (lastName) {
        profileData.append("lastName", lastName)
      }
      if(profileImage){
        profileData.append("profileImage", profileImage)
      }
      if(contactNumber){
        profileData.append("contactNumber", contactNumber)
      }
      if(secondaryEmail){
        profileData.append("secondaryEmail", secondaryEmail)
      }

      await createProfile(profileData)
    } catch (error) {
      console.log("Cannot create profile", error)
    }
  }

    
  return (
    <section>
      <main className='flex'>
        <section className='w-[80%] my-10'>
        <h1 className='p-5 border-t border-l border-r border-gray-300 font-semibold uppercase'>Account Settings</h1>
        <form action='' className='flex justify-center gap-6 border border-1 border-gray-300 p-6 mb-10'>
          <div>
            <div className='bg-blue-300 w-36 h-36 rounded-full'>
            <img src="" alt=""/>
            </div>
          </div>
          <div className='flex flex-col w-full space-y-4'>
          <div className='flex items-center gap-5'>
          <div className='space-y-2 w-full'>
            <label htmlFor="">First name</label>
            <Input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          <div className='space-y-2 w-full'>
            <label htmlFor="">Last Name</label>
            <Input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          </div>
          <div className='flex items-center gap-5'>
          <div className='space-y-2 w-full'>
            <label htmlFor="">Secondary Email(Optional)</label>
            <Input type="text" value={secondaryEmail} onChange={e=>setSecondaryEmail(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          <div className='space-y-2 w-full'>
            <label htmlFor="">Username</label>
            <Input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          </div>
          <div className='flex items-center gap-5'>
          <div className='space-y-2 w-full'>
            <label htmlFor="">Email</label>
            <Input type="text" value={email} onChange={e=>setEmail(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          <div className='space-y-2 w-full'>
            <label htmlFor="">Phone Number</label>
            <Input type="text" value={contactNumber} onChange={e=>setContactNumber(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          </div>
          <Button variant="shop" onClick={(e)=>{handleCreateProfile(e, userInfo._id)}}>SAVE CHANGES</Button>
          </div>
        </form>

          <form action="" className='space-y-4 border border-1 border-gray-300 p-6 mt-10'>
            <h1 className='font-semibold uppercase'>Change Password</h1>
          <div className='space-y-2'>
              <label htmlFor="">Current Password</label>
              <Input type="text" placeholder="" className="outline outline-1 outline-gray-300"/>
            </div>
            <div className='space-y-2'>
              <label htmlFor="">New Password</label>
              <Input type="text" placeholder="8+ characters" className="outline outline-1 outline-gray-300"/>
            </div>
            <div className='space-y-2'>
              <label htmlFor="">Confirm Password</label>
              <Input type="text" placeholder="" className="outline outline-1 outline-gray-300"/>
            </div>
          <Button variant="shop">Change Passowrd</Button>
          </form>

        </section>
      </main>
    </section>
  )
}

export default ProfileSetting