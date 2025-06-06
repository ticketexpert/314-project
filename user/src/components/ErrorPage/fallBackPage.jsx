import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Typography, Box } from '@mui/material';

export default function FallbackPage() {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchErrorMessage = async () => {
      try {
        const response = await axios.get('https://www.api.ticketexpert.me/status');
        setErrorMessage(response.data.message);
      } catch (error) {
        setErrorMessage('Error fetching error message', error);
        console.error('Error fetching error message:', error);
      }
    };
    fetchErrorMessage();
  }, []);
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      padding={4}
    >
      <Typography variant="h2" gutterBottom>
        Site Currently Unavailable
      </Typography>
      
      <Typography variant="h5" gutterBottom>
        We're currently experiencing technical difficulties. Our team is working to resolve the issue.
        The error message is {errorMessage}
      </Typography>

      <Typography variant="body1" marginBottom={4}>
        Our main site is currently experiencing issues. Please check back later
      </Typography>
    </Box>
  );
}
