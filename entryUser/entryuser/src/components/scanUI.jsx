import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Alert,
  Stack,
  CircularProgress,
  ThemeProvider,
  createTheme
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import './scanUI.css';
import TickLogo from '../assets/Tick.svg';

const theme = createTheme({
  typography: {
    fontFamily: '"Rethink Sans", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
  },
});

const colorScheme = {
  blue: {
    primary: '#034AA6',
    light: '#e6f0ff',
    hover: '#023b88'
  },
  yellow: {
    primary: '#f59e42',
    light: '#fff7ed',
    hover: '#d97706'
  },
  green: {
    primary: '#166534',
    light: '#e6f4ea',
    hover: '#14532d'
  },
  red: {
    primary: '#9F1B32',
    light: '#fbe9eb',
    hover: '#7f1628'
  }
};

const ScanUI = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      compareResult(data);
      setError('');
      setShowResult(true);
    }
  };

  const handleError = (err) => {
    setError('Error accessing camera, please allow camera permissions');
    console.error(err);
  };

  const handleScanNext = async (userId, ticketId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.ticketexpert.me/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, status: 'scanned' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Ticket status updated:', data);
      window.location.reload();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      setError('Error updating ticket status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const compareResult = async (result) => {
    try {
      console.log(result[0].rawValue);
      const ticketNumber = result[0].rawValue;
      const response = await fetch(`https://api.ticketexpert.me/api/tickets/${ticketNumber}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setResult({
        ticketNumber: data.ticketId,
        eventId: data.eventId,
        locationDetails: data.locationDetails,
        userId: data.userId,
        status: data.ticketStatus
      });
    } catch (error) {
      console.error('Error fetching ticket data:', error);
      setError('Error fetching ticket data: ' + error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: colorScheme.blue.light,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Container 
          maxWidth={false} 
          sx={{ 
            height: '100%',
            py: 4,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              bgcolor: colorScheme.blue.light,
              p: 4,
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Stack spacing={3} sx={{ flex: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  component="img"
                  src={TickLogo}
                  alt="Ticket Expert Logo"
                  sx={{
                    width: '120px',
                    height: 'auto',
                    mb: 2,
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  color={colorScheme.blue.primary}
                  sx={{ 
                    mb: 1,
                    fontFamily: '"Rethink Sans", sans-serif',
                    fontWeight: 700
                  }}
                >
                  Ticket Scanner
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    fontFamily: '"Rethink Sans", sans-serif',
                    fontWeight: 400
                  }}
                >
                  Scan QR code to verify ticket
                </Typography>
              </Box>

              {!showResult ? (
                <Box 
                  sx={{ 
                    flex: 1,
                    bgcolor: 'white',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    minHeight: '60vh'
                  }}
                >
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    constraints={{
                      video: { facingMode: 'environment' }
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: colorScheme.blue.primary,
                      opacity: 0.5
                    }}
                  >
                    <QrCodeScannerIcon sx={{ fontSize: 100 }} />
                  </Box>
                </Box>
              ) : (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'white',
                    borderRadius: 4,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Stack spacing={2} sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      color={colorScheme.blue.primary}
                      sx={{ 
                        fontFamily: '"Rethink Sans", sans-serif',
                        fontWeight: 600
                      }}
                    >
                      Scan Result
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: colorScheme.blue.light, borderRadius: 2, flex: 1 }}>
                      <Stack spacing={1}>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontFamily: '"Rethink Sans", sans-serif',
                            fontWeight: 400
                          }}
                        >
                          <strong>Ticket Number:</strong> {result.ticketNumber}
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontFamily: '"Rethink Sans", sans-serif',
                            fontWeight: 400
                          }}
                        >
                          <strong>Event ID:</strong> {result.eventId}
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontFamily: '"Rethink Sans", sans-serif',
                            fontWeight: 400
                          }}
                        >
                          <strong>Location:</strong> {JSON.stringify(result.locationDetails)}
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            color: result.status === 'scanned' ? colorScheme.red.primary : colorScheme.green.primary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontFamily: '"Rethink Sans", sans-serif',
                            fontWeight: 500
                          }}
                        >
                          <strong>Status:</strong> 
                          {result.status === 'scanned' ? (
                            <ErrorIcon color="error" />
                          ) : (
                            <CheckCircleIcon color="success" />
                          )}
                          {result.status}
                        </Typography>
                      </Stack>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => handleScanNext(result.userId, result.ticketNumber)}
                      disabled={loading}
                      sx={{
                        bgcolor: colorScheme.blue.primary,
                        borderRadius: 99,
                        fontWeight: 600,
                        py: 1.5,
                        fontFamily: '"Rethink Sans", sans-serif',
                        '&:hover': {
                          bgcolor: colorScheme.blue.hover
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Scan Next'
                      )}
                    </Button>
                  </Stack>
                </Paper>
              )}

              {error && (
                <Alert 
                  severity="error"
                  sx={{ 
                    bgcolor: colorScheme.red.light,
                    color: colorScheme.red.primary,
                    fontFamily: '"Rethink Sans", sans-serif',
                    '& .MuiAlert-icon': {
                      color: colorScheme.red.primary
                    }
                  }}
                >
                  {error}
                </Alert>
              )}
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ScanUI;