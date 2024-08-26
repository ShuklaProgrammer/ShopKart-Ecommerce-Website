import React, { useEffect, useState } from 'react'

//shadcn
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { useChangeUserRoleMutation, useGetAllUsersQuery } from '@/redux/api/userApiSlice'
import { useGetUserProfileQuery } from '@/redux/api/profileApiSlice'
import { useSelector } from 'react-redux'
import Loader from '@/components/mycomponents/Loader'


const Users = () => {

    const { userInfo } = useSelector((state) => state.auth)
    const { data: usersResponse, isLoading } = useGetAllUsersQuery()
    const [changeUserRole] = useChangeUserRoleMutation()
    const { data: profileData } = useGetUserProfileQuery()

    const [roles, setRoles] = useState({})
    const users = usersResponse?.data || []
    console.log(userInfo)

    useEffect(() => {
        if (users && users.length > 0) {
            const initialRole = users.reduce((acc, user) => {
                acc[user._id] = user.role
                return acc
            }, {})
            setRoles(initialRole)
        }
    }, [users])

    const handleRoleChange = async (userId, newRole) => {
        try {
            await changeUserRole({ userId, role: newRole })
            setRoles(prevRoles => ({
                ...prevRoles,
                [userId]: newRole
            }))
        } catch (error) {
            console.log("Cannot change the user role", error)
        }
    }

    if (isLoading) {
        return <div className='h-96'><Loader size='3em' topBorderSize='0.3em' /></div>
    }


    return (
        <section className='flex flex-grow'>
            <main className='w-[90%] border border-1 border-solid border-gray-300'>
                <div className=''>
                    <Table>
                        <TableCaption>A list of your recent users.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">User</TableHead>
                                <TableHead>User Id</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <img src="" alt="" className='w-10 h-10' />
                                        {user.username}
                                    </TableCell>
                                    <TableCell>{user._id}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Select value={roles[user._id] || ""} onValueChange={(value) => handleRoleChange(user._id, value)}>
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder="Change Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">{user.createdAt && new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </section>
    )
}

export default Users