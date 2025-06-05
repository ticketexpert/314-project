import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TELogo from "../../logo"; // Your logo
import postcodeData from "../Auth/postcodeData"

export default function EnterPlace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length > 1) {
      // Flatten all suburbs from all states
      const allSuburbs = Object.values(postcodeData).flat();

      const filtered = allSuburbs.filter((suburb) =>
        suburb.suburb.toLowerCase().includes(value.toLowerCase()) ||
        suburb.postcode.includes(value)
      );

      setResults(filtered.slice(0, 10)); // Limit to top 10 matches
    } else {
      setResults([]);
    }
  };

  const handleSelect = (place) => {
    setSearch(`${place.suburb}, ${place.postcode}`);
    setResults([]);
  };

  return (
    <Box
      minHeight="100vh"
      minWidth="100vw"
      bgcolor="#f5f5f5"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "95%", md: "80vw" },
          minHeight: { xs: "90vh", md: "600px" },
          borderRadius: "24px",
          background: "linear-gradient(to bottom right, #b3001b, #990017)",
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          {/* Title */}
          <Typography variant="h5" color="white" fontWeight="bold" mb={4}>
            Tell us what is your place
          </Typography>

          {/* White search box */}
          <Paper
            elevation={3}
            sx={{
              borderRadius: "24px",
              p: 2,
              bgcolor: "white",
              minHeight: "150px",
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search your place here"
              value={search}
              onChange={handleSearch}
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: "20px",
                  color: "#b3001b",
                },
              }}
              sx={{
                mb: 2,
              }}
            />

            {/* Live Results */}
            {results.length > 0 && (
              <List>
                {results.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => handleSelect(item)}>
                      <ListItemText primary={`${item.suburb}, ${item.postcode}`} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>

        {/* Bottom Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <Button
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              borderRadius: "9999px",
              px: 5,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            onClick={() => navigate("/home")}
          >
            Skip
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#b3001b",
              borderRadius: "9999px",
              px: 5,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={() => navigate("/")}
          >
            Next
          </Button>
        </Box>

        {/* Logo bottom left */}
        <Box mt={4}>
          <TELogo />
        </Box>
      </Paper>
    </Box>
  );
}
