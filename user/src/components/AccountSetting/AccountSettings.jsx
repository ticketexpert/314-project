import React, { useState } from "react";
import {
  Box, Button, Divider, List, ListItem, ListItemButton, ListItemText,
  Paper, Avatar, Typography
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import ProfileContent from "./ProfileContent";
import TicketsContent from "./TicketsContent";
import BillingContent from "./BillingContent";
import NotificationContent from "./NotificationContent";
import SecurityContent from "./SecurityContent";
import { useNavigate } from "react-router-dom";

const menuItems = [
  "Profile",
  "My Tickets",
  "Payment and Billing Address",
  "Notification",
  "Login and Security",
];

export default function AccountSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfileContent />;
      case "My Tickets":
        return <TicketsContent />;
      case "Payment and Billing Address":
        return <BillingContent />;
      case "Notification":
        return <NotificationContent />;
      case "Login and Security":
        return <SecurityContent />;
      default:
        return <ProfileContent />;
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
    <Avatar
      alt="User Avatar"
      src=""
      sx={{ width: 100, height: 100, mb: 2 }}
    />
    <Typography variant="h6" color="white" fontWeight="bold">
      Matthew Gale
    </Typography>
    <Typography color="white" fontSize="14px">
      Wollongong, NSW
    </Typography>
    <Typography color="white" fontSize="12px">
      mattg@ticketexpert.me
    </Typography>
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
    onClick={() => console.log("Logout clicked")}
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
          {renderContent()}
        </Box>
      </Paper>
    </Box>
  );
}
