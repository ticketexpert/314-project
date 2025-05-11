import React from 'react';
import { Box, Container, Typography, Card, CardContent, Stack, Button, IconButton, Divider, Paper, Breadcrumbs, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

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

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Debug log to check cart items
  console.log('Cart Items:', cartItems);

  if (cartItems.length === 0) {
    return (
      <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 6, borderRadius: 4, textAlign: 'center', bgcolor: colorScheme.blue.light }}>
            <ShoppingCartIcon sx={{ fontSize: 64, color: colorScheme.blue.primary, mb: 2 }} />
            <Typography variant="h4" color={colorScheme.blue.primary} gutterBottom fontWeight="bold">
              Your Cart is Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Looks like you haven't added any tickets to your cart yet.
            </Typography>
            <br/><br/>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/events')}
              sx={{ 
                bgcolor: colorScheme.blue.primary,
                borderRadius: 99,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(3,74,166,0.15)',
                '&:hover': { 
                  bgcolor: colorScheme.blue.hover,
                  boxShadow: '0 6px 16px rgba(3,74,166,0.2)'
                }
              }}
            >
              Browse Events
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link underline="hover" color={colorScheme.blue.primary} href="/events" sx={{ fontWeight: 600 }}>
            Events
          </Link>
          <Typography color={colorScheme.blue.primary} fontWeight={600}>
            Shopping Cart
          </Typography>
        </Breadcrumbs>

        <Typography variant="h4" color={colorScheme.blue.primary} gutterBottom fontWeight="bold">
          Your Cart ({cartItems.length} {cartItems.length === 1 ? 'Event' : 'Events'})
        </Typography>
        
        <Stack spacing={3}>
          {cartItems.map((item) => {
            // Calculate subtotal for this event
            const eventSubtotal = Object.values(item.tickets).reduce((total, ticket) => {
              return total + (ticket.price * ticket.quantity);
            }, 0);

            return (
              <Paper key={item.eventId} elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', gap: 3, p: 3 }}>
                  <Box
                    component="img"
                    src={item.eventImage}
                    alt={item.eventTitle}
                    sx={{
                      width: 160,
                      height: 160,
                      objectFit: 'cover',
                      borderRadius: 2
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight="bold" color={colorScheme.blue.primary} gutterBottom>
                      {item.eventTitle}
                    </Typography>
                    
                    <Stack direction="row" spacing={3} mb={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EventIcon sx={{ color: colorScheme.blue.primary }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(item.eventDate).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOnIcon sx={{ color: colorScheme.blue.primary }} />
                        <Typography variant="body2" color="text.secondary">
                          {item.eventVenue}
                        </Typography>
                      </Stack>
                    </Stack>
                    
                    <Paper elevation={0} sx={{ p: 2, bgcolor: colorScheme.yellow.light, borderRadius: 2 }}>
                      {Object.entries(item.tickets).map(([type, ticket]) => (
                        <Box key={`${item.eventId}-${type}`} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mb: 2,
                          '&:last-child': { mb: 0 }
                        }}>
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              {type} × {ticket.quantity}
                            </Typography>
                            <br/>
                            <Typography variant="body2" color="text.secondary">
                              ${ticket.price.toFixed(2)} each
                            </Typography>
                          </Box>
                          <Typography variant="h6" color={colorScheme.yellow.primary} fontWeight="bold">
                            ${(ticket.price * ticket.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                      <Divider sx={{ my: 2, borderColor: colorScheme.yellow.primary, opacity: 0.2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight={600}>
                          Event Subtotal
                        </Typography>
                        <Typography variant="h6" color={colorScheme.yellow.primary} fontWeight="bold">
                          ${eventSubtotal.toFixed(2)}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                  <IconButton
                    onClick={() => removeFromCart(item.eventId)}
                    sx={{ 
                      color: colorScheme.red.primary,
                      borderRadius: 1,
                      p: 1,
                      '&:hover': { 
                        bgcolor: colorScheme.red.light,
                        color: colorScheme.red.hover
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            );
          })}
        </Stack>

        <Paper elevation={0} sx={{ mt: 4, p: 4, borderRadius: 4, bgcolor: colorScheme.green.light }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" color={colorScheme.green.primary}>
              Order Summary
            </Typography>
            <Typography variant="h5" color={colorScheme.green.primary} fontWeight="bold">
              ${getCartTotal().toFixed(2)}
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
              sx={{ 
                flex: 1,
                borderColor: colorScheme.red.primary,
                color: colorScheme.red.primary,
                borderRadius: 99,
                fontWeight: 600,
                py: 1.5,
                '&:hover': { 
                  borderColor: colorScheme.red.hover,
                  bgcolor: colorScheme.red.light
                }
              }}
            >
              Clear Cart
            </Button>
            <Button
              variant="contained"
              sx={{ 
                flex: 1,
                bgcolor: colorScheme.green.primary,
                borderRadius: 99,
                fontWeight: 600,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(22,101,52,0.15)',
                '&:hover': { 
                  bgcolor: colorScheme.green.hover,
                  boxShadow: '0 6px 16px rgba(22,101,52,0.2)'
                }
              }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Cart; 