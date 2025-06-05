import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Stack, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [orderNum, setOrderNum] = useState(null);

  const sendConfirmationEmail = async (orderData) => {
    try {
      const templateParams = {
        toEmail: orderData.contact.email,
        toName: `${orderData.contact.firstName} ${orderData.contact.lastName}`,
        orderID: orderData.pageOrderNumber,
        orderDate: new Date(orderData.date).toLocaleString(),
        orderTotal: orderData.total.toFixed(2),
        eventName: orderData.cartItems[0].eventTitle,
        eventDate: new Date(orderData.cartItems[0].eventDate).toLocaleDateString(),
        eventVenue: orderData.cartItems[0].eventVenue,
      };


      await emailjs.send(
        'service_wjfn4j7', //ServiceID
        'template_il509uq', //TemplateID,
        templateParams,
        '5iRFCEJQiqd2IKEnv' //Public Key
      );
      console.log('Confirmation email sent successfully');
      setEmailSent(true);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  };

  // First useEffect to load order data
  useEffect(() => {
    try {
      const stored = localStorage.getItem('orderSummary');
      if (stored) {
        const parsedOrder = JSON.parse(stored);
        setOrder(parsedOrder);
        console.log('Retrieved order:', parsedOrder);
      } else {
        console.warn('No order summary found in localStorage');
        setError('No order details found');
      }
    } catch (err) {
      console.error('Error retrieving order summary:', err);
      setError('Error loading order details');
    }
  }, []); // Empty dependency array means this runs once on mount

  // Second useEffect to handle email sending
  useEffect(() => {
    if (order && !emailSent) {
      sendConfirmationEmail(order);
    }
  }, [order, emailSent]); // Only run when order or emailSent changes

  // If there's an error, show a message and provide a way to go back
  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, maxWidth: 480, mx: 'auto', textAlign: 'center', bgcolor: '#fff' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/events')}
            sx={{ mt: 2, borderRadius: 99, fontWeight: 600, px: 4, py: 1.5 }}
          >
            Browse Events
          </Button>
        </Paper>
      </Box>
    );
  }

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
              </Typography> <br/>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>Contact:</b> {order.contact.firstName} {order.contact.lastName} ({order.contact.email})
                {/* CONTACT INFO, USE TO SEND EMAIL */}
              </Typography> <br/> 
              <Divider sx={{ my: 1 }} />
              {order.cartItems.map((item, idx) => (
                <Box key={item.eventId || idx} sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.eventTitle}
                  </Typography><br/>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.eventDate).toLocaleDateString()} @ {item.eventVenue}
                  </Typography>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    {Object.entries(item.tickets).map(([type, ticket]) => (
                      <li key={type}>
                        <Typography variant="body2" fontWeight={600}>
                        {ticket.quantity} x {type} Ticket @ ${ticket.price.toFixed(2)}
                        </Typography>
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
              Loading order details...
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
            onClick={() => navigate('/account?tab=tickets')}
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