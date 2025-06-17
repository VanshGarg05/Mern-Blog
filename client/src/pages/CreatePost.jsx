import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useNavigate} from "react-router-dom"

export default function createPost() {

  const[file,setFile] = useState(null)
  const [formData, setFormData] = useState({});
  const[publishError,setPublishError] = useState(null)

  const navigate = useNavigate()

  const handleUploadImage = async()=>{
    
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      const res = await fetch('/api/post/create',{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json()
      if(!res.ok){
        setPublishError(data.message)
        return
      }
      if(res.ok){
        setPublishError(null)
        
        navigate(`/post/${data.data.slug}`)
      }

    } catch (error) {
      setPublishError('Something Went wrong')
    }
  }

  return (
  <div className='p-3 max-w-3xl mx-auto min-h-screen'>
    <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4 sm:flex-row justify-between'>
        <TextInput type ="text" placeholder='Title' required id='title' className='flex-1' onChange={(e)=>setFormData({...formData,title:e.target.value })} />
        <Select onChange={(e)=> setFormData({...formData,category:e.target.value})}>
          <option value="uncategorized">Select a Category</option>
          <option value="javascript">Javascript</option>
          <option value="reactjs">React.js</option>
          <option value="nextjs">Next.js</option>
        </Select>
      </div>
      <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3 '>
        <FileInput type='file' accept='image/*' onChange={(e)=>setFile(e.target.files[0])} />
        <Button type='button' className='bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800' onClick={handleUploadImage} >
          Upload Image
        </Button>
      </div>
      <ReactQuill theme='snow' placeholder='Write Something' className='h-72 mb-12 ' required 
      onChange={
        (value)=>{
          setFormData({...formData,content:value})
      }}/>
      <Button type='submit' className='bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800'>
        Publish
      </Button>
      {
        publishError && <Alert color='failure'>{publishError}</Alert>
      }
    </form>
  </div>
  )
}
