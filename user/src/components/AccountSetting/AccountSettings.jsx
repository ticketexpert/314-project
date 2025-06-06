import React, { useState, useEffect } from "react";
import {
  Box, Button, Divider, List, ListItem, ListItemButton, ListItemText,
  Paper, Avatar, Typography, CircularProgress, Alert, Breadcrumbs, Link
} from "@mui/material";
import { ArrowBack, Home, NavigateNext } from "@mui/icons-material";
import ProfileContent from "./ProfileContent";
import TicketsContent from "./TicketsContent";
import BillingContent from "./BillingContent";
import NotificationContent from "./NotificationContent";
import SecurityContent from "./SecurityContent";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  "Profile",
  "My Tickets",
  "Payment and Billing Address",
  "Notification",
  "Login and Security",
];

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState({ name: "", email: "", location: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the tab parameter from URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    // Map URL parameter to tab name
    const tabMapping = {
      'tickets': 'My Tickets',
      'profile': 'Profile',
      'billing': 'Payment and Billing Address',
      'notification': 'Notification',
      'security': 'Login and Security'
    };

    if (tabParam && tabMapping[tabParam]) {
      setActiveTab(tabMapping[tabParam]);
    }
  }, [location.search]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`https://www.api.ticketexpert.me/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const userData = await response.json();
      
      if (!userData || userData.error) {
        throw new Error('User not found');
      }

      const userDetails = userData;
      
      const mappedUserData = {
        name: userDetails.name || `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim(),
        email: userDetails.email || '',
        location: userDetails.location || '',
        avatar: userDetails.avatar || '',
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        role: userDetails.role || 'Customer',
        userId: userDetails.userId
      };

      setUser(mappedUserData);
      
      Object.entries(mappedUserData).forEach(([key, value]) => {
        localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
      });
    } catch (err) {
      console.error('Error fetching user details:', err);
      console.log('userId', userId);
      setError("Failed to load user details. Please try again later.");
      console.log(err);
      setUser({
        name: localStorage.getItem("userName") || "User",
        email: localStorage.getItem("userEmail") || "",
        location: localStorage.getItem("userLocation") || "",
        avatar: localStorage.getItem("userAvatar") || "",
        firstName: localStorage.getItem("userFirstName") || "",
        lastName: localStorage.getItem("userLastName") || "",
        role: localStorage.getItem("userRole") || "Customer",
        userId: localStorage.getItem("userId") || ""
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");
    
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }

    fetchUserDetails(userId);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userLocation");
    localStorage.removeItem("userAvatar");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleUpdateProfile = async (updatedData) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not authenticated");
      return false;
    }

    try {
      const newUserData = {
        ...user,
        ...updatedData
      };
      
      setUser(newUserData);

      console.log("newUserData: ", newUserData)
      const response = await fetch(`https://api.ticketexpert.me/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });
      
      Object.entries(newUserData).forEach(([key, value]) => {
        localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
      });

      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError("Failed to update profile. Please try again later.");
      return false;
    }
  };

  const fetchUserEvents = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not authenticated");
      return [];
    }

    try {
      const response = await fetch(`https://www.api.ticketexpert.me/api/users/events?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user events');
      }
      const events = await response.json();
      return events;
    } catch (err) {
      console.error('Error fetching user events:', err);
      setError("Failed to load your events. Please try again later.");
      return [];
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      );
    }

    const contentProps = {
      user,
      onUpdateProfile: handleUpdateProfile,
      setError
    };

    switch (activeTab) {
      case "Profile":
        return <ProfileContent {...contentProps} />;
      case "My Tickets":
        return <TicketsContent {...contentProps} />;
      case "Payment and Billing Address":
        return <BillingContent {...contentProps} />;
      case "Notification":
        return <NotificationContent {...contentProps} />;
      case "Login and Security":
        return <SecurityContent {...contentProps} />;
      default:
        return <ProfileContent {...contentProps} />;
    }
  };

  return (
    <Box
      minHeight="100vh"
      minWidth="100vw"
      bgcolor="rgba(0,0,0,0.05)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "100%", md: "90%", lg: "80%" },
          height: { xs: "auto", md: "85vh" },
          borderRadius: "24px",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* Sidebar */}
        <Box
          width="25%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={3}
          sx={{
            backgroundColor: "white",
            borderRight: "1px solid #e0e0e0",
          }}
        >
          {/* Big Avatar Section */}
          <Box
            sx={{
              width: "100%",
              borderRadius: "24px",
              background: "linear-gradient(to bottom right, #02735E, #04D9B1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              p: 3,
              mb: 4,
            }}
          >
            {loading ? (
              <CircularProgress sx={{ color: 'white' }} />
            ) : (
              <>
                <Avatar
                  alt="User Avatar"
                  src={user.avatar}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <Typography variant="h6" color="white" fontWeight="bold">
                  {user.name}
                </Typography>
                <Typography color="white" fontSize="14px">
                  {user.location}
                </Typography>
                <Typography color="white" fontSize="12px">
                  {user.email}
                </Typography>
              </>
            )}
          </Box>

          {/* Menu Items */}
          <Box display="flex" flexDirection="column" width="100%" gap={1}>
            {menuItems.map((text) => (
              <Button
                key={text}
                fullWidth
                onClick={() => setActiveTab(text)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontWeight: activeTab === text ? "bold" : "normal",
                  color: "#02735E",
                  bgcolor: activeTab === text ? "rgba(22, 101, 52, 0.1)" : "transparent",
                  borderRadius: "12px",
                  px: 2,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "linear-gradient(180deg, #02735E 0%, #04D9B1 100%)",
                  },
                }}
              >
                {text}
              </Button>
            ))}
          </Box>

          {/* Logout Button */}
          <Button
            variant="text"
            sx={{
              color: "#b91c1c",
              mt: "auto",
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        {/* Main Content */}
        <Box
          width="75%"
          p={6}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          bgcolor="white"
          overflow="auto"
        >
          {/* Breadcrumb Navigation */}
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ 
              mb: 3,
              '& .MuiBreadcrumbs-separator': {
                color: '#02735E'
              }
            }}
          >
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#02735E',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <Home sx={{ mr: 0.5, fontSize: 20 }} />
              Home
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              Account Settings
            </Typography>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              {activeTab}
            </Typography>
          </Breadcrumbs>

          {renderContent()}
        </Box>
      </Paper>
    </Box>
  );
}
