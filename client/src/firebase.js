// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-36ce3.firebaseapp.com",
  projectId: "mern-blog-36ce3",
  storageBucket: "mern-blog-36ce3.firebasestorage.app",
  messagingSenderId: "460942821049",
  appId: "1:460942821049:web:d95337b1bc712aa4407d68"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);