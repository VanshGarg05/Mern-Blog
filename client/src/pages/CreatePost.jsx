import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom"

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const navigate = useNavigate();

  // Handle image upload (optional - for preview purposes)
  const handleUploadImage = async () => {
    try {
        if (!file) {
            setImageUploadError('Please select an image');
            return;
        }

        setImageUploadError(null);
        setImageUploadProgress('Uploading...');

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://localhost:3000/api/post/uploadImage', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        console.log('Upload response:', data);

        if (!response.ok) {
            setImageUploadError(data?.message || 'Upload failed');
            return;
        }

        const uploadedImageUrl = data?.data;
        console.log('Uploaded Image URL:', uploadedImageUrl);
        setImageFileUrl(uploadedImageUrl);

        if (!uploadedImageUrl) {
            setImageUploadError('No image URL returned from server');
            return;
        }

        console.log(uploadedImageUrl); // correctly updates for React state
        // ✅ if you need to use it immediately, use uploadedImageUrl here

    } catch (error) {
        console.error('Upload error:', error);
        setImageUploadError('Upload failed, please try again');
    } finally {
        setImageUploadProgress(null);
    }
};



  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setPublishError(null);

        // Validate required fields
        if (!formData.title || !formData.content) {
            setPublishError('Title and content are required');
            return;
        }

        const dataToSend = {
            title: formData.title,
            content: formData.content,
            category: formData.category || "uncategorized",
            imageUrl: imageFileUrl || null,  // ✅ explicitly add the stored Cloudinary URL
        };

        const res = await fetch('http://localhost:3000/api/post/create', { // ✅ your backend URL
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)

        });

        let data = null;
        try {
            data = await res.json();
        } catch (parseError) {
            console.error('Response parsing error:', parseError);
            const text = await res.text();
            console.error('Raw response text:', text);
            setPublishError('Server returned an unexpected response.');
            return;
        }

        if (!res.ok) {
            setPublishError(data.message || 'Failed to create post');
            return;
        }

        setPublishError(null);
        navigate(`/post/${data.data.slug}`);

    } catch (error) {
        setPublishError('Something went wrong');
        console.error('Submit error:', error);
    }
};




  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        
        {/* Title and Category */}
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput 
            type="text" 
            placeholder='Title' 
            required 
            id='title' 
            className='flex-1' 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
          <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="uncategorized">Select a Category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        {/* Image Upload Section */}
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput 
            type='file' 
            accept='image/*' 
            onChange={(e) => setFile(e.target.files[0])} 
          />
          <Button 
            type='button' 
            className='bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800' 
            onClick={handleUploadImage}
            disabled={!file || imageUploadProgress}
          >
            {imageUploadProgress || 'Upload Image'}
          </Button>
        </div>

        {/* Image Upload Error */}
        {imageUploadError && (
          <Alert color='failure'>{imageUploadError}</Alert>
        )}

        {/* Image Preview */}
        {imageFileUrl && (
          <div className='w-full h-72 object-cover'>
            <img 
              src={imageFileUrl} 
              alt='Uploaded preview' 
              className='w-full h-full object-cover rounded-lg border'
            />
          </div>
        )}

        {/* Content Editor */}
        <ReactQuill 
          theme='snow' 
          placeholder='Write Something' 
          className='h-72 mb-12' 
          required 
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />

        {/* Submit Button */}
        <Button 
          type='submit' 
          className='bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800'
        >
          Publish
        </Button>

        {/* Error Display */}
        {publishError && (
          <Alert color='failure'>{publishError}</Alert>
        )}
      </form>
    </div>
  );
}