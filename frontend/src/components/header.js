import React from 'react'
import { useNavigate } from 'react-router-dom'
const Header = () => {
    const navigate = useNavigate()
  return (
    <div className='header'>
      <div className='logo'>
            <h2 onClick={()=>{
                navigate('/')
            }}>Resume Builder</h2>
      </div>
      {/* <div className='navbar'>
            <Link className='link' to='/signup'>Sign In</Link>
            <Link className='link' to='/contact'>Contact Us</Link>
      </div> */}
    </div>
  )
}

export default Header
