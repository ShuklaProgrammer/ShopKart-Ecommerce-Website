import React, { useEffect, useRef, useState } from 'react'

import ProfileSidebar from '@/components/mycomponents/ProfileSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { useCreateProfileMutation, useGetUserProfileQuery, useUpdateProfileMutation } from '@/redux/api/profileApiSlice';
import Loader from '@/components/mycomponents/Loader';

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const ProfileSetting = () => {

  const navigate = useNavigate()
  const imgRef = useRef(null)

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
    }
    if(userInfo){
      setUsername(userInfo.username)
      setEmail(userInfo.email || "Not Added")
      setContactNumber(userInfo.mobileNumber || "Not Added")
    }
  }, [profileData])

  const handleCreateProfile = async(e, userId) => {
    e.preventDefault()
    setIsloading("addAddress")
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

  const handleImageUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file)
        setProfileImage(imageUrl)
    }
  };

  const handleImgUpload = () => {
    if(imgRef.current){
      imgRef.current.click()
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
              <input type="file" ref={imgRef} onChange={handleImageUploadChange} className='hidden' name="" id="" />
            <div onClick={handleImgUpload} className='flex items-center justify-center bg-blue-300 sm:w-36 sm:h-36 w-20 h-20 rounded-full'>
            <img src={profileImage} alt="" className='w-36 h-36 rounded-full' />
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
            <label htmlFor="" className='flex items-center justify-between'>Email
            {userInfo?.isEmailVerified ? (
                <span className='flex items-center gap-1 font-semibold text-green-700 bg-green-100 border-1 border border-solid border-green-400 rounded-md text-sm p-1'>
                  <FaCheckCircle /> Verified
                </span>
              ) : (
                <span className='flex items-center gap-1 font-semibold text-red-700 bg-red-100 border-1 border border-solid border-red-400 rounded-md text-sm p-1'>
                  <FaTimesCircle /> Not Verified
                </span>
              )}
              </label>
              <div className='relative'>
            <Input type="text" disabled value={email} onChange={e=>setEmail(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 font-semibold cursor-pointer" onClick={()=>navigate("/verify-email")}>Edit</span>
            </div>
          </div>
          <div className='space-y-2 w-full'>
            <label htmlFor="" className='flex items-center justify-between'>Phone Number
            {userInfo?.isMobileVerified ? (
                <span className='flex items-center gap-1 font-semibold text-green-700 bg-green-100 border-1 border border-solid border-green-400 rounded-md text-sm p-1'>
                  <FaCheckCircle /> Verified
                </span>
              ) : (
                <span className='flex items-center gap-1 font-semibold text-red-700 bg-red-100 border-1 border border-solid border-red-400 rounded-md text-sm p-1'>
                  <FaTimesCircle /> Not Verified
                </span>
              )}
            </label>
            <div className='relative'>
            <Input type="text" disabled value={contactNumber} onChange={(e)=>setContactNumber(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300"/>
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 font-semibold cursor-pointer" onClick={() => navigate("/verify-phone")}>Edit</span>
            </div>
          </div>
          </div>
          <Button variant="shop" disabled={isLoading} onClick={(e)=>{handleCreateProfile(e, userInfo._id)}}>{isLoading ? <span className='flex items-center gap-2'>Saving...<Loader size='2em' topBorderSize='0.2em' center={false} fullScreen={false}/></span> : "SAVE CHANGES"}</Button>
          </div>
        </form>

          <form action="" className='space-y-4 border border-1 border-gray-300 p-6 mt-10'>
            <h1 className='font-semibold uppercase'>Change Password</h1>
          <div className='space-y-2'>
              <label htmlFor="">Password</label>
              <Input type="text" value="XXXXXXXXXX" disabled placeholder="" className="outline outline-1 outline-gray-300"/>
            </div>
          <Button variant="shop" onClick={() => navigate("/reset-password", {state: {text: "Change"}})}>Change Passowrd</Button>
          </form>

        </section>
      </main>
    </section>
  )
}

export default ProfileSetting