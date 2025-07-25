import { useState } from 'react'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import About from './pages/About.jsx' 
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Header from './components/Header.jsx'
import FooterCom from './components/Footer.jsx'   
import PrivateRouter from "./components/PrivateRouter.jsx"
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRouter .jsx'
import CreatePost from "./pages/CreatePost.jsx"
import UpdatePost from './pages/UpdatePost.jsx'
import PostPage from './pages/PostPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Search from './pages/Search.jsx'

function App() {

  return (
  <BrowserRouter>
  <ScrollToTop/>
  <Header/>
  <Routes>

    <Route path="/" element={<Home/> }/>
    <Route path='/about' element={<About/>}/>
    <Route path='/sign-in' element={<SignIn/>}/>
    <Route path='/sign-up' element={<SignUp/>}/>
    <Route path='/search' element={<Search/>}/>

    <Route element={<PrivateRouter/>}>
    <Route path='/dashboard' element={<Dashboard/>}/>
    </Route>

    
    <Route element={<OnlyAdminPrivateRoute/>}>
    <Route path='/create-post' element={<CreatePost/>}/>
    <Route path='/update-post/:postId' element={<UpdatePost/>}/>
    </Route>
    <Route path='/projects' element={<Projects/>}/>
    <Route path='/post/:postSlug' element={<PostPage />} />

  </Routes>
  <FooterCom/>
  </BrowserRouter>
  )
}

export default App
