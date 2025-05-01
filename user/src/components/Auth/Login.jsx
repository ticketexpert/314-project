import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography, Link as MuiLink, Paper, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TELogo from "../../logo"; // Same logo as signup

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to verify credentials
    // For now, we'll simulate a successful login
    localStorage.setItem('isLoggedIn', 'true');
    navigate("/");
  };

  return (
    <Box
      minHeight="100vh"
      minWidth="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "90%", md: "70vw" },
          height: { xs: "auto", md: "80vh" },
          display: "flex",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            width: "60%",
            background: "linear-gradient(to bottom right, #b3001b, #990017)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: 4,
          }}
        >
          <TELogo />
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            width: "60%",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            padding: 6,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="#1e40af" mb={3}>
          Back to your<br/>
          TicketExpert Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              fullWidth
              placeholder="Email Address"
              name="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              sx={{ height: '56px' }}
            />

            <TextField
              margin="normal"
              fullWidth
              placeholder="Password"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              sx={{ height: '56px' }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                width: "300px",
                height: "50px",
                mt: 3,
                backgroundColor: "#1e40af",
                borderRadius: "9999px",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1e3a8a" },
              }}
            >
              Log In
            </Button>

            <Divider sx={{ my: 3, width: '100%' }} />

            <Typography mt={2} color="#1e40af">
              New to TicketExpert?{" "}
              <MuiLink component={Link} to="/signup" underline="hover" color="#1e40af" fontWeight="bold">
                Sign up
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
