import React, { useState } from "react";
import { Box, Typography, Switch, Divider } from "@mui/material";
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import { Button } from "@mui/material";

export default function NotificationContent() {
  const [notifications, setNotifications] = useState({
    bookingConfirmation: true,
    eventReminders: false,
    eventChanges: true,
    specialAnnouncements: true,
  });

  const toggleSwitch = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    {
      key: "bookingConfirmation",
      label: "Booking Confirmation",
      desc: "Get notified as soon as your booking is confirmed.",
    },
    {
      key: "eventReminders",
      label: "Event Reminders",
      desc: "We'll remind you before your event so you never miss a thing.",
    },
    {
      key: "eventChanges",
      label: "Event Changes",
      desc: "Be the first to know if your event details change – like time, location, or schedule.",
    },
    {
      key: "specialAnnouncements",
      label: "Special Announcements",
      desc: "Get updates on offers, new features, or important announcements related to your event.",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        background: "#fff",
        borderRadius: 4,
        p: { xs: 2, md: 4 },
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        sx={{ color: "#166534", letterSpacing: 1 }}
      >
        Notification
      </Typography>

      {items.map((item, idx) => (
        <React.Fragment key={item.key}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={idx === items.length - 1 ? 0 : 2}
            py={1}
            sx={{
              transition: "background 0.2s",
              borderRadius: 2,
              "&:hover": {
                background: "#f6fdf8",
              },
            }}
          >
            <Box>
              <Typography fontWeight="bold" fontSize="1.1rem">
                {item.label}
              </Typography> <br/>
              <Typography fontSize="15px" color="gray">
                {item.desc}
              </Typography>
            </Box>
            <Switch
              checked={notifications[item.key]}
              onChange={() => toggleSwitch(item.key)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#166534",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#166534",
                },
                transform: "scale(1.2)",
              }}
            />
          </Box>
          {idx !== items.length - 1 && <Divider sx={{ my: 0.5 }} />}
        </React.Fragment>
      ))}

    </Box>
  );
}
