import React from 'react'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashComp() {

  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(()=>{

    const fetchUsers = async()=>{
      try {
        const res = await fetch('/api/user/getUsers?limit=5')
        const data = await res.json()
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    const fetchPosts = async()=>{
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.data.posts);
          setTotalPosts(data.data.totalPosts);
          setLastMonthPosts(data.data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    const fetchComments = async()=>{
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.data.comments);
          setTotalComments(data.data.totalComments);
          
          setLastMonthComments(data.data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if(currentUser.data.isAdmin){
      fetchUsers()
      fetchPosts()
      fetchComments()
    }
    

  },[currentUser])


  return (
  <div className="p-3 md:mx-auto">
   <div className="flex-wrap flex gap-4 justify-center">
   <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
      <div className="flex justify-between">
        <div className="">
          <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
          <p className='text-2xl'>{totalUsers}</p>
        </div>
          <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg'/>
      </div>
        <div className="flex  gap-2 text-sm">
          <span className='text-green-500 flex items-center'>
            <HiArrowNarrowUp/>
            {lastMonthUsers}
          </span>
          <div className="text-gray-500">Last Month</div>
        </div>
    </div>
    <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
      <div className="flex justify-between">
        <div className="">
          <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
          <p className='text-2xl'>{totalComments}</p>
        </div>
          <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg'/>
      </div>
        <div className="flex  gap-2 text-sm">
          <span className='text-green-500 flex items-center'>
            <HiArrowNarrowUp/>
            {lastMonthComments}
          </span>
          <div className="text-gray-500">Last Month</div>
        </div>
    </div>
    <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
      <div className="flex justify-between">
        <div className="">
          <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
          <p className='text-2xl'>{totalPosts}</p>
        </div>
          <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg'/>
      </div>
        <div className="flex  gap-2 text-sm">
          <span className='text-green-500 flex items-center'>
            <HiArrowNarrowUp/>
            {lastMonthPosts}
          </span>
          <div className="text-gray-500">Last Month</div>
        </div>
    </div>
   </div>
   <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
    <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
      <div className='flex justify-between  p-3 text-sm font-semibold'>
        <h1 className='text-center p-2'>Recent Users</h1>
        
          <Link to={'/dashboard?tab=users'} > 
            <Button className='bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800'>
              See all
            </Button>
          </Link>
      </div>
       <Table hoverable>
        <TableHead>
          <TableHeadCell>User Image</TableHeadCell>
          <TableHeadCell>Username</TableHeadCell>
        </TableHead>
        {users && users.map((user)=>(
          <TableBody key={user.id} className='divide-y'>
            <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800' >
              <TableCell>
                <img src={user.profilePicture} alt="user" className='w-10 h-10 rounded-full bg-gray-500' />
              </TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
          </TableBody>
        ))}
       </Table>

    </div>
    <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
      <div className='flex justify-between  p-3 text-sm font-semibold'>
        <h1 className='text-center p-2'>Recent Comments</h1>
        
          <Link to={'/dashboard?tab=comments'} > 
            <Button className='bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800'>
              See all
            </Button>
          </Link>
      </div>
       <Table hoverable>
        <TableHead>
          <TableHeadCell>Comment Content</TableHeadCell>
          <TableHeadCell>Likes</TableHeadCell>
        </TableHead>
        {comments && comments.map((comment)=>(
          <TableBody key={comment.id} className='divide-y'>
            <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800' >
              <TableCell className='w-96'>
               <p className='line-clamp-2'>{comment.content}</p>
              </TableCell>
              <TableCell>{comment.numberOfLikes}</TableCell>
            </TableRow>
          </TableBody>
        ))}
       </Table>

    </div>
    <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
      <div className='flex justify-between  p-3 text-sm font-semibold'>
        <h1 className='text-center p-2'>Recent Posts</h1>
        
          <Link to={'/dashboard?tab=posts'} > 
            <Button className='bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800'>
              See all
            </Button>
          </Link>
      </div>
       <Table hoverable>
        <TableHead>
          <TableHeadCell>Post Image</TableHeadCell>
          <TableHeadCell>Post Title</TableHeadCell>
          <TableHeadCell>Category</TableHeadCell>
        </TableHead>
        {posts && posts.map((post)=>(
          <TableBody key={post.id} className='divide-y'>
            <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800' >
              <TableCell>
                <img src={post.image} alt="post" className='w-14 h-10 rounded-md bg-gray-500' />
              </TableCell>
              <TableCell className='w-96'>{post.title}</TableCell>
              <TableCell className='w-5' >{post.category}</TableCell>
            </TableRow>
          </TableBody>
        ))}
       </Table>

    </div>
   </div>
  </div>
  )
}
