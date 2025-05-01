import React, { useState } from "react";
import { Box, Button, Chip, Typography, Paper, Grid, Stack } from "@mui/material";
import favoriteData from "./favoriteData";
import TELogo from "../../logo"; // Your logo component
import { useNavigate } from "react-router-dom";

export default function FavoritePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const handleSelect = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
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
            Tell us what is your favourites
          </Typography>

          {/* White card */}
          <Paper
            elevation={3}
            sx={{
              borderRadius: "24px",
              p: 4,
              bgcolor: "white",
            }}
          >
            {favoriteData.map((category) => (
              <Box key={category.category} mb={4}>
                <Typography variant="h6" color="#b3001b" fontWeight="bold" mb={2}>
                  {category.category}
                </Typography>

                <Grid container spacing={2}>
                  {category.items.map((item) => (
                    <Grid item key={item}>
                      <Chip
                        label={item}
                        clickable
                        variant={selected.includes(item) ? "filled" : "outlined"}
                        color={selected.includes(item) ? "primary" : "default"}
                        onClick={() => handleSelect(item)}
                        sx={{
                          borderRadius: "9999px",
                          px: 2,
                          py: 1,
                          borderColor: "#1e40af",
                          color: "#1e40af",
                          "&.MuiChip-filled": {
                            bgcolor: "#1e40af",
                            color: "white",
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
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
            onClick={() => navigate("/signup/place")}
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
