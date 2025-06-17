import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import {Link} from 'react-router-dom'

export default function DashPosts() {
  const { currentUser } = useSelector((state)=>state.user)
  const [userPosts,setUserPosts] = useState([])
  useEffect(()=>{
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?userId=${currentUser.data._id}`)
        const data = await res.json()

        if(res.ok){
          console.log(data);
          setUserPosts(data.data.posts)
        }
        
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.data.isAdmin) {
      fetchPosts()
    }
  },[currentUser.data._id])
  return (
    <div>
      {currentUser.data.isAdmin && userPosts.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
          <TableHead>
            <TableHeadCell>Date updated</TableHeadCell>
            <TableHeadCell>Post Image</TableHeadCell>
            <TableHeadCell>Post Title</TableHeadCell>
            <TableHeadCell>Category</TableHeadCell>
            <TableHeadCell>Delete</TableHeadCell>
            <TableHeadCell>
              <span className=''>Edit</span>
            </TableHeadCell>
          </TableHead>
          {userPosts.map((post)=>(
            <TableBody>
              <TableRow>
                <TableCell> {new Date(post.updatedAt).toLocaleDateString()} </TableCell>
                <TableCell>
                  <Link to={`post/${post.slug}`}>
                    <img src='post.image' alt="post.title" className='w-20 h-10 object-cover bg-gray-500' />
                  </Link>
                </TableCell>
              </TableRow>
            </TableBody>
      ))}
        </Table>
        </>
      ) : (
        <p>You have no Posts yet!</p>
      )}
    </div>
  )
}

