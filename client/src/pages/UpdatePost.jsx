import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getPosts?postId=${postId}`);
        const data = await res.json();
        
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.data.posts[0]);
          
          // Set the existing image URL for preview
          setImageFileUrl(data.data.posts[0].image || null);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }

      setImageUploadError(null);
      setImageUploadProgress("Uploading...");

      const formDataForUpload = new FormData();
      formDataForUpload.append("image", file);

      const response = await fetch("/api/post/uploadImage", {
        method: "POST",
        body: formDataForUpload,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (!response.ok) {
        setImageUploadError(data?.message || "Upload failed");
        return;
      }

      const uploadedImageUrl = data?.data;
      console.log("Uploaded Image URL:", uploadedImageUrl);
      setImageFileUrl(uploadedImageUrl);

      if (!uploadedImageUrl) {
        setImageUploadError("No image URL returned from server");
        return;
      }

      // Update formData with new image URL
      setFormData((prevData) => ({
        ...prevData,
        image: uploadedImageUrl,
      }));
    } catch (error) {
      console.error("Upload error:", error);
      setImageUploadError("Upload failed, please try again");
    } finally {
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setPublishError(null);

      // Validate required fields
      if (!formData.title || !formData.content) {
        setPublishError("Title and content are required");
        return;
      }

      const dataToSend = {
        title: formData.title,
        content: formData.content,
        category: formData.category || "uncategorized",
        image: imageFileUrl || formData.image || "", // Use new image URL or existing one
      };

      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser.data._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);

        navigate(`/post/${data.data.slug}`);
      }
    } catch (error) {
      setPublishError("Something Went wrong");
    }
  };

 

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={formData.title || ""}
            
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category || "uncategorized"}
          >
            <option value="uncategorized">Select a Category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="travel">Travel</option>
            <option value="food">Food</option>
            <option value="technology">Technology</option>
            <option value="education">Education & Personal Growth</option>
          </Select>
        </div>

        {/* Image Upload Section */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3 ">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800"
            onClick={handleUploadImage}
            disabled={!file || imageUploadProgress}
          >
            {imageUploadProgress || "Upload Image"}
          </Button>
        </div>

        {/* Image Upload Error */}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {/* Image Preview */}
        {imageFileUrl && (
          <div className="w-full h-72 object-cover">
            <img
              src={imageFileUrl}
              alt="Post preview"
              className="w-full h-full object-cover rounded-lg border"
            />
          </div>
        )}

        <ReactQuill
          theme="snow"
          value={formData.content || ""}
          placeholder="Write Something"
          className="h-72 mb-12 "
          required
          onChange={(value) => {
            setFormData(prevData => ({ ...prevData, content: value }));
          }}
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800"
        >
          Update Post
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
