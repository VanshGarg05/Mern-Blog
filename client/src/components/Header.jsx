import React from 'react'
import { useEffect ,useState } from 'react'
import {Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput}  from "flowbite-react"
import {Link, useLocation,useNavigate } from "react-router-dom"
import {AiOutlineSearch} from "react-icons/ai"
import{FaMoon} from "react-icons/fa"
import {useSelector} from "react-redux"
import { useDispatch } from 'react-redux'
import { signoutSuccess } from '../redux/user/userSlice'
import { toggleTheme  } from '../redux/theme/themeSlice'




const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    <Navbar className='border-b-2'>
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r  from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Vansh's</span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={ AiOutlineSearch}
          value={searchTerm}
          onChange={(e)=> setSearchTerm(e.target.value)}
          
        />
      </form>
      <Button className='w-15 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch/>
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10  sm:inline' color='gray' pill onClick={()=>dispatch(toggleTheme()) }>
          <FaMoon/>
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.data.profilePicture} rounded />
            }
          >
            <DropdownHeader>
              <span className='block text-sm'>@{currentUser.data.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.data.email}
              </span>
            </DropdownHeader>
            <Link to={'/dashboard?tab=profile'}>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleSignout}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
          <Button className='px-2 py-1 bg-gradient-to-r  from-purple-500  to-blue-500 rounded-lg text-white'>
            SignIn
          </Button> 
        </Link>
        )}
       
        <NavbarToggle/>
      </div>

      
      <NavbarCollapse className="">
  <NavbarLink as={Link} to='/'>
    Home
  </NavbarLink>
  <NavbarLink as={Link} to='/about'>
    About
  </NavbarLink>
  <NavbarLink as={Link} to='/projects'>
    Projects
  </NavbarLink>
</NavbarCollapse>


    </Navbar>
  )
}

export default Header