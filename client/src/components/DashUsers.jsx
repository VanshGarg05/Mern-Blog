import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import {Form, Link} from 'react-router-dom'
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,

} from 'flowbite-react';
import { FaCheck, FaTimes} from 'react-icons/fa'

import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashUsers() {
  const { currentUser } = useSelector((state)=>state.user)
  const [users,setUsers ] = useState([])
  const [showMore,setShowMore] = useState(true)
  const [showModal,setShowModal] = useState(false)
  const [userIdToDelete , setUserIdToDelete] = useState('')
  useEffect(()=>{
    const fetchUsers = async () => {
      try {
          const res = await fetch(`/api/user/getUsers`)
          const data = await res.json()
          console.log(data);
          if(res.ok){
              setUsers(data.users)
              if(data.users.length<9){
                  setShowMore(false)
                }
            }
            
        
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.data.isAdmin) {
      fetchUsers()
    }
  },[currentUser.data._id])


  const handleShowMore = async () => {
    const startIndex = users.length
    try {
      const res = await fetch(`/api/user/getUsers?startIndex=${startIndex}`)

      const data = await res.json()

      if(res.ok){
        setUsers((prev)=>[...prev,...data.users])
        if(data.users.length<9){
          setShowMore(false)
        }
      }
      
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteUser = ()=> {
    
  }

  

  return (
    <div className='tabel-auto md:mx-auto p-3 '>
      {currentUser.data.isAdmin && users.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
          <TableHead>
            <TableRow>

            <TableHeadCell>Date created</TableHeadCell>
            <TableHeadCell>User Image</TableHeadCell>
            <TableHeadCell>Username</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Admin</TableHeadCell>
            <TableHeadCell>Delete</TableHeadCell>
           
            </TableRow>
          </TableHead>
          {users.map((user)=>(
            
            <TableBody className='divide-y' key={user._id}>
              <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <TableCell > {new Date(user.createdAt).toLocaleDateString() } </TableCell>
                <TableCell>
             
                    <img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                 
                </TableCell>
                <TableCell>
                 {user.username}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? (<FaCheck className='text-green-500'/>) : (<FaTimes className='text-red-500'/>) }</TableCell>
                <TableCell>
                  <span onClick={()=>{
                    setShowModal(true)
                    setUserIdToDelete(user._id)
                  }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                    Delete
                  </span>
                </TableCell>
               
              </TableRow>
            </TableBody>
      ))}
        </Table>
        {
          showMore && (<button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
            Show More
          </button>)
        }
        </>
      ) : (
        <p>You have no Users yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <ModalHeader />
        <ModalBody>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500'>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='red' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

