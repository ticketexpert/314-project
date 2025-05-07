import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography, Link as MuiLink, Paper, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TELogo from "../../logo";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    navigate("/signup/favorite");
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      minWidth="100vw"
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
        <TELogo/>
        </Box>
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
          <Typography variant="h5" fontWeight="bold" color="#1e40af" mb={3}>
            Create your TicketExpert Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={12}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  placeholder="First Name"
                  name="firstName"
                  variant="outlined"
                  value={formData.firstName}
                  onChange={handleChange}
                  sx={{ height: '56px' , width: "140%"}}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  placeholder="Last Name"
                  name="lastName"
                  variant="outlined"
                  value={formData.lastName}
                  onChange={handleChange}
                  sx={{ height: '56px' , width: "140%"}}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              fullWidth
              placeholder="Email Address"
              name="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              sx={{ height: '56px'}}
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
              Sign Up
            </Button>

            <Divider sx={{ my: 3, width: '100%' }} />

            <Typography mt={2} color="#1e40af">
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
