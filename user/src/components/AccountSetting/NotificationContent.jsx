import React, { useState } from "react";
import { Box, Typography, Switch } from "@mui/material";

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

  return (
    <Box width="100%">
      <Typography variant="h4" fontWeight="bold" mb={4} color="#166534">
        Notification
      </Typography>

      {[
        { key: "bookingConfirmation", label: "Booking Confirmation", desc: "Get notified as soon as your booking is confirmed." },
        { key: "eventReminders", label: "Event Reminders", desc: "We'll remind you before your event so you never miss a thing." },
        { key: "eventChanges", label: "Event Changes", desc: "Be the first to know if your event details change." },
        { key: "specialAnnouncements", label: "Special Announcements", desc: "Updates on offers, new features, and more." },
      ].map((item) => (
        <Box key={item.key} display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography fontWeight="bold">{item.label}</Typography>
            <Typography fontSize="14px" color="gray">{item.desc}</Typography>
          </Box>
          <Switch
            checked={notifications[item.key]}
            onChange={() => toggleSwitch(item.key)}
          />
        </Box>
      ))}
    </Box>
  );
}
