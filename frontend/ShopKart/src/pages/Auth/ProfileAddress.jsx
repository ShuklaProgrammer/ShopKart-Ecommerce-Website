import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateProfileMutation, useDeleteUserProfileMutation, useGetUserProfileQuery, useUpdateProfileMutation } from '@/redux/api/profileApiSlice'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { GrAdd } from "react-icons/gr";
import { FaAddressCard } from "react-icons/fa6";


const ProfileAddress = () => {

    const [editAddress, setEditAddress] = useState(false)
    const [addAddress, setAddAddress] = useState(false)

    const [currentAddressId, setCurrentAddressId] = useState(null)

    //delivery details
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [address, setAddress] = useState("")
    const [country, setCountry] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [postalCode, setPostalCode] = useState("")

    const [createProfileAddress] = useCreateProfileMutation()
    const [updateProfileAddress] = useUpdateProfileMutation()
    const [deleteProfileAddress] = useDeleteUserProfileMutation()

    const { userInfo } = useSelector((state) => state.auth)
    const {data: profileData} = useGetUserProfileQuery({userId: userInfo._id})

    const profileAddressData = profileData?.data?.deliveryAddress || []



    useEffect(()=>{
        if(editAddress && currentAddressId !== null){
            const addressData = profileAddressData.find(addr => addr._id === currentAddressId)
            if(addressData){
            setFullName(addressData.fullName)
            setEmail(addressData.email)
            setPhoneNumber(addressData.phoneNumber)
            setCompanyName(addressData.companyName)
            setAddress(addressData.address)
            setCountry(addressData.country)
            setState(addressData.state)
            setCity(addressData.city)
            setPostalCode(addressData.postalCode)
            }
        }
    }, [editAddress, currentAddressId, profileAddressData])

    const handleEditAddress = (addressId) => {
        setEditAddress(true);
        setAddAddress(false);
        setCurrentAddressId(addressId);
    };

    const handleAddAddress = () => {
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setCompanyName("");
        setAddress("");
        setCountry("");
        setState("");
        setCity("");
        setPostalCode("");
        setAddAddress(true);
        setEditAddress(false);
        setCurrentAddressId(null)
    }

    const handleCreateProfileAddress = async (e) => {
        e.preventDefault()
        try {
            const profileData = {
                userId: userInfo._id,
                deliveryAddress: {
                    fullName,
                    email,
                    phoneNumber,
                    companyName,
                    address,
                    country,
                    state,
                    city,
                    postalCode
                }
            }
            await createProfileAddress(profileData)
            setAddAddress(false)
        } catch (error) {
            console.log("Failed to add address", error)
        }
    }

    const handleUpdateProfileAddress = async(e) => {
        e.preventDefault()
        try {
            const profileData = {
                userId: userInfo._id,
                addressId: currentAddressId,
                deliveryAddress: {
                    fullName,
                    email,
                    phoneNumber,
                    companyName,
                    address,
                    country,
                    state,
                    city,
                    postalCode
                }
            }
            await updateProfileAddress(profileData)
            setEditAddress(false)
        } catch (error) {
            console.log("Cannot update address", error)
        }
    }

    const handleDeleteProfileAddress = async(addressId) => {
        try {
            await deleteProfileAddress({userId: userInfo._id, addressId})
        } catch (error) {
            console.log("Cannot delete the profile address")
        }
    }

    return (
        <section className='w-[80%] border-1 border border-gray-300 p-6 my-10'>
            {profileAddressData.length === 0 && !addAddress && (
            <div className='flex justify-center items-center my-20'>
                <div className='flex flex-col items-center gap-3'>
                <FaAddressCard className='text-8xl text-blue-400'/>
                <h2 className='text-lg font-semibold'>No Address Found!</h2>
                <Button variant="shop" onClick={handleAddAddress} className="p-6 rounded-sm">Add Delivery Address</Button>
                </div>
            </div>
            )}
            {profileAddressData.length > 0 && (
                <div onClick={handleAddAddress} className='border-1 border border-gray-300 p-4 hover:cursor-pointer'>
                <h1 className='flex items-center gap-3 text-blue-500 font-semibold'><GrAdd/>Add More Addresses</h1>
                </div>
            )}
            {profileAddressData.map((addressData, index) => (
            <div key={index} className='border-1 border border-gray-300 p-5 mt-5'>
                <h1 className='text-lg font-semibold'>{addressData.fullName}</h1>
                <p>{addressData.address}, {addressData.city}, {addressData.state}, {addressData.country} - {addressData.postalCode}</p>
                <h4>Phone Number: <span>{addressData.phoneNumber}</span></h4>
                <h4>Email: <span>{addressData.email}</span></h4>
                <Button onClick={()=>handleEditAddress(addressData._id)} className="border-2 border-blue-500 bg-white text-blue-500 font-semibold hover:bg-blue-50 mt-4">Edit Address</Button>
                <Button onClick={()=>handleDeleteProfileAddress(addressData._id)} className="border-2 border-orange-400 bg-white text-orange-400 font-semibold hover:bg-orange-50 ml-4">Delete Address</Button>
                {editAddress && currentAddressId === addressData._id && (
                <form action="" className='w-full space-y-4 mt-10'>
                <h1 className='uppercase font-semibold text-blue-500'>{editAddress ? "Edit Delivery Address" : "Add Delivey Address"}</h1>
                <div className='flex items-center gap-5'>
                    <div className='space-y-2 w-full'>
                        <label htmlFor="">Full Name</label>
                        <Input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                    </div>
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Company Name (Optional)</label>
                    <Input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Address</label>
                    <Input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Country</label>
                    <Input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Region/State</label>
                    <Input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='flex items-center gap-5'>
                    <div className='space-y-2 w-full'>
                        <label htmlFor="">City</label>
                        <Input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                    </div>
                    <div className='space-y-2 w-full'>
                        <label htmlFor="">Zip Code</label>
                        <Input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                    </div>
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Email</label>
                    <Input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Phone Number</label>
                    <Input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='flex items-center gap-5'>
                <Button variant="shop" onClick={editAddress ? handleUpdateProfileAddress : handleCreateProfileAddress}>{editAddress ? "Update Address" : "Add Address"}</Button>
                <h2 className='text-lg text-blue-400 font-semibold hover:cursor-pointer' onClick={()=>{setEditAddress(false); setAddAddress(false)}}>Cancel</h2>
                </div>
               </form>
            )}
            </div>
            ))}
            {/* form for delivery address */}
            {addAddress && (
            <form action="" className='w-full space-y-4 mt-10'>
                <h1 className='uppercase font-semibold'>{editAddress ? "Edit Delivery Address" : "Add Delivey Address"}</h1>
                <div className='flex items-center gap-5'>
                    <div className='space-y-2 w-full'>
                        <label htmlFor="">Full Name</label>
                        <Input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                    </div>
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Company Name (Optional)</label>
                    <Input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Address</label>
                    <Input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Country</label>
                    <Input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Region/State</label>
                    <Input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='flex items-center gap-5'>
                    <div className='space-y-2 w-full'>
                        <label htmlFor="">City</label>
                        <Input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                    </div>
                    <div className='space-y-2 w-full'>
                        <label htmlFor="">Zip Code</label>
                        <Input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                    </div>
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Email</label>
                    <Input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='space-y-2'>
                    <label htmlFor="">Phone Number</label>
                    <Input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                </div>
                <div className='flex items-center gap-5'>
                <Button variant="shop" onClick={editAddress ? handleUpdateProfileAddress : handleCreateProfileAddress}>{editAddress ? "Update Address" : "Add Address"}</Button>
                <h2 className='text-lg text-blue-400 font-semibold hover:cursor-pointer' onClick={()=>{setEditAddress(false); setAddAddress(false)}}>Cancel</h2>
                </div>
            </form>
            )}
        </section>
    )
}

export default ProfileAddress