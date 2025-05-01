import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function ProfileContent() {
  const [formData, setFormData] = useState({
    firstName: "Matthew",
    lastName: "Gale",
    email: "mattg@ticketexpert.me",
    phone: "04932112345",
    bio: "Hi, Something should be here",
    preferredLocation: "Wollongong, NSW 2500",
    country: "Australia",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Profile saved:", formData);
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#166534',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#166534',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#166534',
    },
  };

  return (
    <Box width="100%">
      <Typography variant="h4" fontWeight="bold" mb={4} color="#166534">
        Profile
      </Typography>

      <Box width="100%" display="flex" flexDirection="column" gap={3}>
        <Box display="flex" gap={2}>
          <TextField
            label="First Name"
            fullWidth
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            sx={textFieldStyles}
          />
          <TextField
            label="Last Name"
            fullWidth
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            sx={textFieldStyles}
          />
        </Box>

        <TextField
          label="Email Address"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          sx={textFieldStyles}
        />

        <TextField
          label="Phone Number"
          fullWidth
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          sx={textFieldStyles}
        />

        <TextField
          label="Bio"
          fullWidth
          multiline
          rows={3}
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          sx={textFieldStyles}
        />

        <Box display="flex" gap={2}>
          <TextField
            label="Preferred Location"
            fullWidth
            name="preferredLocation"
            value={formData.preferredLocation}
            onChange={handleChange}
            sx={textFieldStyles}
          />
          <TextField
            label="Country"
            fullWidth
            name="country"
            value={formData.country}
            onChange={handleChange}
            sx={textFieldStyles}
          />
        </Box>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#166534", mt: 2 }}
          onClick={handleSave}
        >
          Save Information
        </Button>
      </Box>
    </Box>
  );
}
