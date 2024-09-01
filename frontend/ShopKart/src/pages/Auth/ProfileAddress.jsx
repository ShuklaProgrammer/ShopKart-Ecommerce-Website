import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateProfileMutation, useDeleteUserProfileMutation, useGetUserProfileQuery, useUpdateProfileMutation } from '@/redux/api/profileApiSlice'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { GrAdd } from "react-icons/gr";
import { FaAddressCard } from "react-icons/fa6";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Loader from '@/components/mycomponents/Loader'



const ProfileAddress = () => {

    const [editAddress, setEditAddress] = useState(false)
    const [addAddress, setAddAddress] = useState(false)

    const [isLoading, setIsLoading] = useState(null)

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
    const { data: profileData, isLoading: isProfileLoading } = useGetUserProfileQuery({ userId: userInfo._id })

    const profileAddressData = profileData?.data?.deliveryAddress || []



    useEffect(() => {
        if (editAddress && currentAddressId !== null) {
            const addressData = profileAddressData.find(addr => addr._id === currentAddressId)
            if (addressData) {
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
        setIsLoading("addAddress")
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
            setIsLoading(null)
        } catch (error) {
            console.log("Failed to add address", error)
            setIsLoading(null)
        }
    }

    const handleUpdateProfileAddress = async (e) => {
        setIsLoading("updateAddress")
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
            setIsLoading(null)
        } catch (error) {
            console.log("Cannot update address", error)
            setIsLoading(null)
        }
    }

    const handleDeleteProfileAddress = async (addressId) => {
        setIsLoading("deleteAddress")
        try {
            await deleteProfileAddress({ userId: userInfo._id, addressId })
            setIsLoading(null)
        } catch (error) {
            console.log("Cannot delete the profile address")
            setIsLoading(null)
        }
    }

    if(isProfileLoading){
        return <div className='h-96'><Loader size='3em' topBorderSize='0.3em'/></div>
    }

    return (
        <section className='sm:w-[80%] border-1 border border-gray-300 sm:p-6 p-2 my-10'>
            {profileAddressData.length === 0 && !addAddress && (
                <div className='flex justify-center items-center my-20'>
                    <div className='flex flex-col items-center gap-3'>
                        <FaAddressCard className='text-8xl text-blue-400' />
                        <h2 className='text-lg font-semibold'>No Address Found!</h2>
                        <Button variant="shop" onClick={handleAddAddress} className="p-6 rounded-sm">Add Delivery Address</Button>
                    </div>
                </div>
            )}
            {profileAddressData.length > 0 && (
                <div onClick={handleAddAddress} className='border-1 border border-gray-300 sm:p-4 p-2 hover:cursor-pointer'>
                    <h1 className='flex items-center gap-3 text-blue-500 font-semibold'><GrAdd />Add More Addresses</h1>
                </div>
            )}
            {profileAddressData.map((addressData, index) => (
                <div key={index} className='border-1 border border-gray-300 sm:p-5 p-3 mt-5'>
                    <h1 className='text-lg font-semibold'>{addressData.fullName}</h1>
                    <p>{addressData.address}, {addressData.city}, {addressData.state}, {addressData.country} - {addressData.postalCode}</p>
                    <h4>Phone Number: <span>{addressData.phoneNumber}</span></h4>
                    <h4>Email: <span>{addressData.email}</span></h4>
                    <Button onClick={() => handleEditAddress(addressData._id)} className="border-2 border-blue-500 bg-white text-blue-500 font-semibold hover:bg-blue-50 mt-4">Edit Address</Button>
                    <AlertDialog>
                        <AlertDialogTrigger>
                    <Button className="border-2 border-orange-400 bg-white text-orange-400 font-semibold hover:bg-orange-50 ml-4">Delete Address</Button>
                            
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your address
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className={`${isLoading === "deleteAddress" ? "opacity-50 pointer-events-none" : ""}`} onClick={() => handleDeleteProfileAddress(addressData._id)}>{isLoading === "deleteAddress" ? <span className='flex items-center gap-2'>Deleting...<Loader size='2em' topBorderSize='0.2em' center={false} fullScreen={false}/></span> : "Delete"}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
                                <Button variant="shop" onClick={editAddress ? handleUpdateProfileAddress : handleCreateProfileAddress}>{editAddress ? <>{isLoading === "updateAddress" ? <span className='flex items-center gap-2'>Updating...<Loader size='2em' topBorderSize='0.2em' center={false} fullScreen={false}/></span> : "Update Address"}</> : "Add Address"}</Button>
                                <h2 className='text-lg text-blue-400 font-semibold hover:cursor-pointer' onClick={() => { setEditAddress(false); setAddAddress(false) }}>Cancel</h2>
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
                        <Button variant="shop" disabled={isLoading === "addAddress"} onClick={editAddress ? handleUpdateProfileAddress : handleCreateProfileAddress}>{editAddress ? "Update Address" : <>{isLoading === "addAddress" ? <span className='flex items-center gap-2'>Adding...<Loader size='2em' topBorderSize='0.2em' center={false} fullScreen={false}/></span>: "Add Address"}</>}</Button>
                        <h2 className='text-lg text-blue-400 font-semibold hover:cursor-pointer' onClick={() => { setEditAddress(false); setAddAddress(false) }}>Cancel</h2>
                    </div>
                </form>
            )}
        </section>
    )
}

export default ProfileAddress