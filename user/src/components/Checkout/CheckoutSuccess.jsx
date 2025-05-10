import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Stack, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('orderSummary');
    if (stored) {
      setOrder(JSON.parse(stored));
      // Optionally clear after reading:
      // localStorage.removeItem('orderSummary');
    }
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, maxWidth: 480, mx: 'auto', textAlign: 'center', bgcolor: '#fff' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={800} color="success.main" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Thank you for your purchase. Your tickets have been booked and a confirmation email has been sent to you.
        </Typography>
        {/* Order summary section */}
        <Box sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, textAlign: 'center' }}>
            Order Summary
          </Typography>
          {order ? (
            <>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>Order Date:</b> {new Date(order.date).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>Contact:</b> {order.contact.firstName} {order.contact.lastName} ({order.contact.email})
              </Typography>
              <Divider sx={{ my: 1 }} />
              {order.cartItems.map((item, idx) => (
                <Box key={item.eventId || idx} sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.eventTitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.eventDate).toLocaleDateString()} @ {item.eventVenue}
                  </Typography>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    {Object.entries(item.tickets).map(([type, ticket]) => (
                      <li key={type}>
                        {ticket.quantity} x {type} Ticket @ ${ticket.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" fontWeight={700}>
                Total Paid: ${order.total.toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              (No order details found)
            </Typography>
          )}
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/events')}
            sx={{ borderRadius: 99, fontWeight: 600, px: 4, py: 1.5 }}
          >
            Browse More Events
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => navigate('/account/tickets')}
            sx={{ borderRadius: 99, fontWeight: 600, px: 4, py: 1.5 }}
          >
            View My Tickets
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CheckoutSuccess; 