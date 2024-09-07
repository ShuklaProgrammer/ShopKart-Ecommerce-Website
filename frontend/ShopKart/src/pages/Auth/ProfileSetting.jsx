import React, { useEffect, useState } from 'react'

import ProfileSidebar from '@/components/mycomponents/ProfileSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { useCreateProfileMutation, useGetUserProfileQuery, useUpdateProfileMutation } from '@/redux/api/profileApiSlice';
import Loader from '@/components/mycomponents/Loader';

const ProfileSetting = () => {

  const [isLoading, setIsloading] = useState(null)

  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [secondaryEmail, setSecondaryEmail] = useState("")
  const [email, setEmail] = useState("")
  const [contactNumber, setContactNumber] = useState("")

  const {userInfo} = useSelector((state) => state.auth)
  // console.log(userInfo)
  
  const {data: profileData, isLoading: isProfileLoading} = useGetUserProfileQuery({userId: userInfo._id})
  console.log(profileData)
  
  const [createProfile] = useCreateProfileMutation()
  const [updateProfile] = useUpdateProfileMutation()

  useEffect(()=>{
    if(profileData && profileData?.data?._id){
      setFirstName(profileData.data.firstName)
      setLastName(profileData.data.lastName)
      setSecondaryEmail(profileData.data.secondaryEmail)
      setContactNumber(profileData.data.contactNumber)
      setUsername(userInfo.username)
      setEmail(userInfo.email)
    }
  }, [profileData])

  const handleCreateProfile = async(e, userId) => {
    setIsloading("addAddress")
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
      setIsloading(null)
    } catch (error) {
      console.log("Cannot create profile", error)
      setIsloading(null)
    }
  }


  if(isProfileLoading){
    return <div className='h-96'><Loader size='3em' topBorderSize='0.3em'/></div>
  }

    
  return (
    <section>
      <main className='sm:flex mx-2 sm:mx-0'>
        <section className='sm:w-[80%] my-10'>
        <h1 className='p-5 border-t border-l border-r border-gray-300 font-semibold uppercase'>Account Settings</h1>
        <form action='' className='sm:flex justify-center gap-6 border border-1 border-gray-300 p-6 mb-10'>
          <div className='flex flex-col items-center'>
            <div className='bg-blue-300 sm:w-36 sm:h-36 w-20 h-20 rounded-full'>
            <img src="" alt=""/>
            </div>
          </div>
          <div className='flex flex-col w-full space-y-4'>
          <div className='sm:flex items-center space-y-4 sm:space-y-0 gap-5'>
          <div className='space-y-2 w-full'>
            <label htmlFor="">First name</label>
            <Input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          <div className='space-y-2 w-full'>
            <label htmlFor="">Last Name</label>
            <Input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          </div>
          <div className='sm:flex items-center gap-5 space-y-4 sm:space-y-0'>
          <div className='space-y-2 w-full'>
            <label htmlFor="">Secondary Email(Optional)</label>
            <Input type="text" value={secondaryEmail} onChange={e=>setSecondaryEmail(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          <div className='space-y-2 w-full'>
            <label htmlFor="">Username</label>
            <Input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          </div>
          <div className='sm:flex items-center gap-5 space-y-4 sm:space-y-0'>
          <div className='space-y-2 w-full'>
            <label htmlFor="">Email</label>
            <Input type="text" value={email} onChange={e=>setEmail(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          <div className='space-y-2 w-full'>
            <label htmlFor="">Phone Number</label>
            <Input type="text" value={contactNumber} onChange={(e)=>setContactNumber(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
          </div>
          </div>
          <Button variant="shop" disabled={isLoading === "addProfile"} onClick={(e)=>{handleCreateProfile(e, userInfo._id)}}>{isLoading === "addProfile" ? <span>Saving...<Loader size='2em' topBorderSize='0.2em' center={false} fullScreen={false}/></span> : "SAVE CHANGES"}</Button>
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