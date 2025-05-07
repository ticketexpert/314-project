import React, { useState, useEffect, useRef } from 'react'
import NavigationMenuDemo from './NavigationMenuDemo';
import AvatarDemo from './Avatar';
import AuthBtn from './AuthBtn';
import "./Navbar.css";
import Tick from '../../assets/Tick.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    // Check localStorage on component mount
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div ref={navRef} className={`rootNavBar${scrolled ? ' scrolled' : ''}`}>
        <div>
            <Link to="/">
                <img src={Tick} alt="TicketExpert Logo" style={{ height: 40 }} />
            </Link>
        </div>
        <div>
            <NavigationMenuDemo />
        </div>
        <div>
            {isLoggedIn ? (
                <AvatarDemo onLogout={handleLogout} />
            ) : (
                <AuthBtn onLogin={handleLogin} />
            )}
        </div>
    </div>
  )
}

export default Navbar
