import React, { useState, useEffect, useRef } from 'react'
import NavigationMenuDemo from './NavigationMenuDemo';
import AvatarDemo from './Avatar';
import AuthBtn from './AuthBtn';
import "./Navbar.css";
import Tick from '../../assets/Tick.svg';
import { Link } from 'react-router-dom';
import { Badge, IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const navRef = useRef(null);
  const { getCartCount } = useCart();

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

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage
      const response = await fetch(`https://api.ticketexpert.me/api/userNotifcation/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.currentNotifs);
        console.log(data.currentNotifs);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

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
        <div className="nav-right">
            <Link to="/cart" className="cart-link">
                <Badge badgeContent={getCartCount()} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 20, minWidth: 20 } }}>
                    <IconButton sx={{ color: '#9F1B32' }}>
                        <ShoppingCartIcon />
                    </IconButton>
                </Badge>
            </Link>
            {isLoggedIn && (
              <>
                <IconButton 
                  onClick={handleNotificationClick}
                  sx={{ color: '#9F1B32' }}
                >
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={notificationAnchorEl}
                  open={Boolean(notificationAnchorEl)}
                  onClose={handleNotificationClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 300,
                      maxHeight: 400,
                      borderRadius: 2,
                    },
                  }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <MenuItem key={index} onClick={handleNotificationClose}>
                        <Box>
                          <Typography variant="subtitle2">{notification.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      <Typography variant="body2" color="text.secondary">
                        No new notifications
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
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
