import React from "react";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const AuthBtn = () => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button
        component={Link}
        to="/login"
        variant="text"
        sx={{
          color: "#b3001b",
          fontSize: "16px",
          textTransform: "none",
          "&:hover": {
            textDecoration: "underline",
            backgroundColor: "transparent",
          },
        }}
      >
        Log in
      </Button>

      <Button
        component={Link}
        to="/signup"
        variant="contained"
        sx={{
          backgroundColor: "#b3001b",
          color: "white",
          borderRadius: "99px",
          paddingX: 3,
          paddingY: 1.25,
          fontSize: "16px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#990017",
          },
        }}
      >
        Sign up
      </Button>
    </Stack>
  );
};

export default AuthBtn;
