import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'

import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,

} from 'flowbite-react';
import { FaCheck, FaTimes} from 'react-icons/fa'

import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashComments() {
  const { currentUser } = useSelector((state)=>state.user)
  const [comments,setComments ] = useState([])
  const [showMore,setShowMore] = useState(true)
  const [showModal,setShowModal] = useState(false)
  const [commentIdToDelete , setCommentIdToDelete] = useState('')
  useEffect(()=>{
    const fetchComments = async () => {
      try {
          const res = await fetch(`/api/comment/getComments`)
          const data = await res.json()
          
          if(res.ok){
              setComments(data.data.comments)
              if(data.data.comments.length<9){
                  setShowMore(false)
                }
            }
            
        
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.data.isAdmin) {
      fetchComments()
    }
  },[currentUser.data._id])


  const handleShowMore = async () => {
    const startIndex = comments.length
    try {
      const res = await fetch(`/api/comment/getComments?startIndex=${startIndex}`)

      const data = await res.json()

      if(res.ok){
        setComments((prev)=>[...prev,...data.comments])
        if(data.comments.length<9){
          setShowMore(false)
        }
      }
      
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteComment = async ()=> {
    setShowModal(false)
    try {
        const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
            setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
            setShowModal(false);
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error.message);
    }
  }

  

  return (
    <div className='tabel-auto md:mx-auto p-3 '>
      {currentUser.data.isAdmin && comments.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
          <TableHead>
            <TableRow>

            <TableHeadCell>Date created</TableHeadCell>
            <TableHeadCell>Comment Content</TableHeadCell>
            <TableHeadCell>Number of Likes</TableHeadCell>
            <TableHeadCell>PostId</TableHeadCell>
            <TableHeadCell>UserId</TableHeadCell>
            <TableHeadCell>Delete</TableHeadCell>
           
            </TableRow>
          </TableHead>
          {comments.map((comment)=>(
            
            <TableBody className='divide-y' key={comment._id}>
              <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <TableCell > {new Date(comment.updatedAt).toLocaleDateString() } </TableCell>
                <TableCell>
             
                   {comment.content}
                </TableCell>
                <TableCell>
                 {comment.numberOfLikes}
                </TableCell>
                <TableCell>{comment.postId}</TableCell>
                <TableCell> {comment.userId}</TableCell>
                <TableCell>
                  <span onClick={()=>{
                    setShowModal(true)
                    setCommentIdToDelete(comment._id)
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
        <p>You have no Comments yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <ModalHeader />
        <ModalBody>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='red' onClick={handleDeleteComment}>
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

