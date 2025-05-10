import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography, Link as MuiLink, Paper, Divider, Alert, LinearProgress, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TELogo from "../../logo";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  return score;
}

function getStrengthLabel(score) {
  switch (score) {
    case 0: return { label: "Very Weak", color: "error" };
    case 1: return { label: "Weak", color: "warning" };
    case 2: return { label: "Fair", color: "warning" };
    case 3: return { label: "Good", color: "info" };
    case 4: return { label: "Strong", color: "success" };
    case 5: return { label: "Very Strong", color: "success" };
    default: return { label: "Very Weak", color: "error" };
  }
}

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (getPasswordStrength(formData.password) < 3) {
      setError("Password is too weak. Please use a stronger password.");
      return;
    }
    try {
      const res = await fetch("https://www.api.ticketexpert.me/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: "Customer",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Your backend returns 401 for duplicate user
        if (res.status === 401 && data.error === "User already exists") {
          setError("User already exists. Please use a different email.");
        } else {
          setError(data.error || "Signup failed.");
        }
        return;
      }
      setSuccess("Account created successfully!");
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', data.userId || data.id); // Save userId for later use
      setTimeout(() => navigate("/signup/favorite"), 1000);
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const { label: strengthLabel, color: strengthColor } = getStrengthLabel(passwordStrength);

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <Box
      display="flex"
      minHeight ='100vh'
      minWidth="100vw"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
    >
      <Paper
        elevation={8}
        sx={{
          width: { xs: "100%", md: "90vw" },
          maxWidth: '90vw',
          display: "flex",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: '0 8px 32px rgba(3,58,166,0.10)',
        }}
      >
        <Box
          sx={{
            width: { xs: '0%', md: '70%' },
            background: "linear-gradient(135deg, #02735E 60%, #04D9B1 100%)",
            display: { xs: 'none', md: 'flex' },
            flexDirection: "column",
            alignContent: 'flex-end',
            alignItems: 'flex-end',
            p: 4,
          }}
        >
          <TELogo style={{ width: 120, marginBottom: 0 }} />
        </Box>
        {/* Right Side */}
        <Box
          sx={{
            width: { xs: '100%', md: '55%' },
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            p: { xs: 3, md: 6 },
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="#1e40af" mb={2}>
          Create your TicketExpert Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 400 }}>
              <TextField
                  margin="dense"
                  fullWidth
                  label="First Name"
                  name="firstName"
                  variant="outlined"
                  value={formData.firstName}
                  onChange={handleChange}
                  sx={{ height: '56px' }}
                />
              <TextField
                margin="dense"
                fullWidth
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={formData.lastName}
                onChange={handleChange}
                sx={{ height: '56px' }}
              />
            <TextField
              margin="dense"
              fullWidth
              label="Email Address"
              name="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              sx={{ height: '56px'}}
            />
            <TextField
              margin="dense"
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              sx={{ height: '56px' }}
            />
            {formData.password && (
              <Box mb={2}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Typography fontSize="0.95rem" color="text.secondary" mr={1}>
                    Password Strength:
                  </Typography>
                  <Typography fontWeight="bold" color={`${strengthColor}.main`}>
                    {strengthLabel}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(passwordStrength / 5) * 100}
                  color={strengthColor}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    background: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      transition: "width 0.4s",
                    },
                  }}
                />
              </Box>
            )}
            <TextField
              margin="dense"
              fullWidth
              label="Reconfirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{ height: '56px' }}
            />

            {/* Password Requirements */}
            <List dense sx={{ mb: 2 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color={formData.password.length >= 8 ? "success" : "disabled"} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="At least 8 characters" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color={/[A-Z]/.test(formData.password) ? "success" : "disabled"} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="At least one uppercase letter" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color={/[0-9]/.test(formData.password) ? "success" : "disabled"} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="At least one number" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color={/[^A-Za-z0-9]/.test(formData.password) ? "success" : "disabled"} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="At least one special character" />
              </ListItem>
            </List>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                width: "100%",
                height: "50px",
                mt: 2,
                backgroundColor: "#1e40af",
                borderRadius: "9999px",
                textTransform: "none",
                fontWeight: "bold",
                fontSize: '1.1rem',
                letterSpacing: 0.5,
                boxShadow: '0 2px 8px rgba(30,64,175,0.10)',
                "&:hover": { backgroundColor: "#1e3a8a" },
              }}
            >
              Sign Up
            </Button>

            <Divider sx={{ my: 3, width: '100%' }} />

            <Typography mt={2} color="#1e40af" align="center">
              Already have a TicketExpert account?{" "}
              <MuiLink component={Link} to="/login" underline="hover" color="#1e40af" fontWeight="bold">
                Log in
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
