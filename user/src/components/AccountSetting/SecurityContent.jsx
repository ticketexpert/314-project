import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function SecurityContent() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = () => {
    console.log("Password change requested:", formData);
  };

  return (
    <Box width="100%">
      <Typography variant="h4" fontWeight="bold" mb={4} color="#166534">
        Login and Security
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Current Password"
          fullWidth
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
        />
        <TextField
          label="New Password"
          fullWidth
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
        />
        <TextField
          label="Reconfirm New Password"
          fullWidth
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          sx={{ backgroundColor: "#166534", mt: 2 }}
          onClick={handleChangePassword}
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );
}
