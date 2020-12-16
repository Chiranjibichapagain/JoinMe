import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import jwt from 'jsonwebtoken'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faComment } from '@fortawesome/free-solid-svg-icons'

import GoogleLogin from '../GoogleUserLogin'
import logoDark from '../../Assets/logoDark.svg'
import logoLight from '../../Assets/logoSecondary.svg'
import './Navbar.scss'

const Navbar = () => {
  const [navBg, setNavBg] = useState(true)
  const [cookies, setCookie] = useCookies(['x-auth-token'])
  const decodedToken = jwt.decode(cookies['x-auth-token'])
  const userId = decodedToken?.sub

  const changeNavStyle = () => {
    window.scrollY >= 50 ? setNavBg(false) : setNavBg(true)
  }

  window.addEventListener('scroll', changeNavStyle)

  return (
    <nav className={navBg ? 'nav' : 'nav nav--active'}>
      <img
        className='nav__image nav__image--logo'
        src={window.innerWidth > 1024 ? logoDark : logoLight}
        alt='logo'
      />
      {userId ? (
        <div className='nav__icons'>
          <FontAwesomeIcon className='nav__icon' icon={faBell} />
          <FontAwesomeIcon className='nav__icon' icon={faComment} />
          <Link to={`/${userId}`}>
            <img
              className='nav__image nav__image--profile'
              src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
              alt='profile'
            />
          </Link>
        </div>
      ) : (
        <div className='nav__login'>
          <GoogleLogin />
        </div>
      )}
    </nav>
  )
}

export default Navbar
