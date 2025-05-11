import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  CircularProgress,
  Snackbar
} from "@mui/material";

export default function ProfileContent({ user, onUpdateProfile, setError }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    preferredLocation: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      // Split the full name into first and last name
      const nameParts = (user.name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || ""; // Join the rest as last name

      setFormData({
        firstName,
        lastName,
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        preferredLocation: user.location || "",
        country: user.country || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Combine first and last name back into full name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      // Prepare the data to match the backend structure
      const updatedData = {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.preferredLocation,
        country: formData.country,
      };

      const success = await onUpdateProfile(updatedData);
      
      if (success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
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

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
        <CircularProgress />
      </Box>
    );
  }

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
            disabled={loading}
            placeholder="Enter first name"
          />
          <TextField
            label="Last Name"
            fullWidth
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            sx={textFieldStyles}
            disabled={loading}
            placeholder="Enter last name"
          />
        </Box>

        <TextField
          label="Email Address"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          sx={textFieldStyles}
          disabled={loading}
        />

        <TextField
          label="Phone Number"
          fullWidth
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          sx={textFieldStyles}
          disabled={loading}
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
          disabled={loading}
        />

        <Box display="flex" gap={2}>
          <TextField
            label="Preferred Location"
            fullWidth
            name="preferredLocation"
            value={formData.preferredLocation}
            onChange={handleChange}
            sx={textFieldStyles}
            disabled={loading}
          />
          <TextField
            label="Country"
            fullWidth
            name="country"
            value={formData.country}
            onChange={handleChange}
            sx={textFieldStyles}
            disabled={loading}
          />
        </Box>

        <Button
          variant="contained"
          sx={{ 
            backgroundColor: "#166534", 
            mt: 2,
            height: "48px",
            "&:hover": {
              backgroundColor: "#14502d"
            }
          }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save Information"}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
