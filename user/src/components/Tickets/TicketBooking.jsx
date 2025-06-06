import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Stack, Button, Select, MenuItem, Divider, Container, Paper, Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import { useCart } from '../../context/CartContext';

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
  }
};

export default function TicketBooking() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { cartItems, addToCart } = useCart();

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.ticketexpert.me/api/events/${id}`);
        if (!res.ok) throw new Error('Event not found');
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleQuantityChange = (ticketType, newQuantity) => {
    setSelected(prev => ({
      ...prev,
      [ticketType]: newQuantity
    }));
  };

  // Subtotal calculation
  const subtotal = event && event.pricing
    ? event.pricing.reduce((sum, ticket) => sum + (selected[ticket.type] || 0) * ticket.price, 0)
    : 0;

  const handleAddToCart = () => {
    console.log('Event object:', event);

    // Find a unique event ID
    const eventId = event._id || event.id || event.eventId || event.uuid;
    if (!eventId) {
      alert('Event is missing a unique ID. Cannot add to cart.');
      return;
    }

    // Create tickets object with only the selected quantities
    const ticketsToAdd = {};
    Object.entries(selected).forEach(([type, quantity]) => {
      if (quantity > 0) {
        // Find the corresponding ticket in event.pricing
        const ticketInfo = event.pricing.find(t => t.type === type);
        if (ticketInfo) {
          ticketsToAdd[type] = {
            type: type,
            quantity: quantity,
            price: ticketInfo.price
          };
        }
      }
    });

    if (Object.keys(ticketsToAdd).length > 0) {
      // Check if event already exists in cart
      const exists = cartItems.some(item => item.eventId === eventId);

      // Always pass a unique event ID
      const eventData = {
        id: eventId,
        title: event.title,
        fromDateTime: event.fromDateTime,
        venue: event.venue,
        image: event.image,
        category: event.category,
        region: event.region
      };

      addToCart(eventData, ticketsToAdd); // Your context logic will merge or add as needed

      setSnackbarOpen(true);
      setSelected({});
    }
  };

  if (loading) return <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}><Typography variant="h6">Loading...</Typography></Container>;
  if (error) return <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}><Typography color="error">{error}</Typography></Container>;
  if (!event) return null;

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Header Section - Blue only */}
        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
          <Box
            component="img"
            src={event.image}
            alt={event.title}
            sx={{
              width: '100%',
              height: { xs: 200, md: 320 },
              objectFit: 'cover',
            }}
          />
          <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: colorScheme.blue.light }}>
            <Stack spacing={2}>
              <Chip 
                label={event.category} 
                sx={{ 
                  bgcolor: colorScheme.blue.primary,
                  color: 'white',
                  fontWeight: 600, 
                  mb: 1,
                  width: 'fit-content'
                }} 
              />
              <Typography variant="h3" fontWeight="bold" color={colorScheme.blue.primary} sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                {event.title}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EventIcon sx={{ color: colorScheme.blue.primary }} />
                  <Typography variant="body1" color={colorScheme.blue.primary} fontWeight={500}>
                    {new Date(event.fromDateTime).toLocaleDateString()} - {new Date(event.toDateTime).toLocaleDateString()}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOnIcon sx={{ color: colorScheme.blue.primary }} />
                  <Typography variant="body1" color={colorScheme.blue.primary} fontWeight={500}>
                    {event.venue}, {event.region}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, mb: 4, bgcolor: colorScheme.yellow.light }}>
          <Typography variant="h5" fontWeight="bold" color={colorScheme.yellow.primary} mb={3}>
            Select Your Tickets
          </Typography>
          <Stack spacing={2}>
            {Array.isArray(event.pricing) && event.pricing.length > 0 ? (
              event.pricing.map(ticket => {
                const qty = selected[ticket.type] || 0;
                const soldOut = (ticket.numTicketsAvailable || 0) === 0;
                return (
                  <Card key={ticket.type} variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(245,158,66,0.08)' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                      <Box>
                        <Typography fontWeight="bold" color="black">${ticket.price} each</Typography>
                        <br/>
                        <Typography variant="body2" color="black" fontWeight={500}>
                          {ticket.type}
                        </Typography>
                        <br/>
                        <Typography variant="caption" color={(ticket.numTicketsAvailable || 0) <= 10 ? "error" : "text.secondary"}>
                          {(ticket.numTicketsAvailable || 0) === 0 ? 'Sold out' : `${ticket.numTicketsAvailable} tickets left`}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                        <Button
                          size="medium"
                          variant="outlined"
                          sx={{
                            minWidth: 40,
                            height: 40,
                            px: 0,
                            borderColor: colorScheme.yellow.primary,
                            color: colorScheme.yellow.primary,
                            borderRadius: 2,
                            bgcolor: qty > 0 ? '#fffbe6' : 'white',
                            '&:hover': { bgcolor: '#fff3cd' }
                          }}
                          disabled={qty <= 0 || soldOut}
                          onClick={() => handleQuantityChange(ticket.type, Math.max(0, qty - 1))}
                          aria-label={`Decrease ${ticket.type} tickets`}
                        >
                          <RemoveIcon fontSize="medium" />
                        </Button>
                        <input
                          type="number"
                          min={0}
                          value={qty}
                          disabled={soldOut}
                          onChange={e => {
                            let val = Number(e.target.value);
                            if (isNaN(val) || val < 0) val = 0;
                            if (val > (ticket.numTicketsAvailable || 0)) val = ticket.numTicketsAvailable || 0;
                            handleQuantityChange(ticket.type, val);
                          }}
                          style={{
                            width: 56,
                            height: 40,
                            textAlign: 'center',
                            fontSize: 18,
                            border: qty === (ticket.numTicketsAvailable || 0) ? '2px solid #f59e42' : '1px solid #ccc',
                            borderRadius: 4,
                            padding: '4px 0',
                            margin: '0 4px',
                            background: soldOut ? '#f5f5f5' : 'white',
                            color: soldOut ? '#aaa' : 'black',
                            outline: qty === (ticket.numTicketsAvailable || 0) ? '2px solid #f59e42' : 'none',
                            transition: 'border 0.2s, outline 0.2s',
                          }}
                          aria-label={`Number of ${ticket.type} tickets`}
                        />
                        <Button
                          size="medium"
                          variant="outlined"
                          sx={{
                            minWidth: 40,
                            height: 40,
                            px: 0,
                            borderColor: colorScheme.yellow.primary,
                            color: colorScheme.yellow.primary,
                            borderRadius: 2,
                            bgcolor: qty < (ticket.numTicketsAvailable || 0) && !soldOut ? '#fffbe6' : 'white',
                            '&:hover': { bgcolor: '#fff3cd' }
                          }}
                          disabled={qty >= (ticket.numTicketsAvailable || 0) || soldOut}
                          onClick={() => handleQuantityChange(ticket.type, Math.min(qty + 1, ticket.numTicketsAvailable || 0))}
                          aria-label={`Increase ${ticket.type} tickets`}
                        >
                          <AddIcon fontSize="medium" />
                        </Button>
                      </Box>
                      <Stack spacing={0.5} alignItems="flex-end" sx={{ minWidth: 90 }}>
                        <Typography variant="body2" color="black" fontWeight={600}>
                          Total: ${(qty * ticket.price).toFixed(2)}
                        </Typography>
                        {qty === (ticket.numTicketsAvailable || 0) && (ticket.numTicketsAvailable || 0) > 0 && (
                          <Typography variant="caption" color="error">Max available</Typography>
                        )}
                      </Stack>
                    </CardContent>

                  </Card>
                );
              })
            ) : (
              <Typography>No tickets available for this event.</Typography>
            )}
          </Stack>
          <Divider sx={{ my: 3, borderColor: colorScheme.yellow.primary, opacity: 0.2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight={700} color="black">Subtotal:</Typography>
            <Typography variant="h5" fontWeight={700} color={colorScheme.yellow.primary}>${subtotal.toFixed(2)}</Typography>
          </Box>
          <Stack direction="row" spacing={2} mt={4}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: colorScheme.yellow.primary,
                borderRadius: 99,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                color: 'white',
                boxShadow: '0 4px 12px rgba(245,158,66,0.15)',
                '&:hover': { 
                  bgcolor: colorScheme.yellow.hover,
                  boxShadow: '0 6px 16px rgba(245,158,66,0.2)'
                }
              }}
              disabled={!Object.values(selected).some(qty => qty > 0)}
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: colorScheme.yellow.primary,
                color: colorScheme.yellow.primary,
                borderRadius: 99,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { 
                  borderColor: colorScheme.yellow.hover,
                  bgcolor: 'rgba(245,158,66,0.04)'
                }
              }}
              disabled={!Object.values(selected).some(qty => qty > 0)}
            >
              Go to checkout
            </Button>
          </Stack>
          {!Object.values(selected).some(qty => qty > 0) && (
              <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                Please select at least one ticket to continue.
              </Typography>
            )}
        </Paper>

        {/* Ticket Info Section - Green only, improved style */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: colorScheme.green.light, mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <InfoOutlinedIcon sx={{ color: colorScheme.green.primary }} />
            <Typography variant="h6" fontWeight="bold" color={colorScheme.green.primary}>Ticket Information</Typography>
          </Stack>
          <Divider sx={{ mb: 2, borderColor: colorScheme.green.primary, opacity: 0.2 }} />
          <Stack spacing={2}>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <EmailIcon sx={{ color: colorScheme.green.primary, mt: 0.5 }} />
              <Box>
                <Typography fontWeight={600} color="black">Electronic Ticket</Typography>
                <br/>
                <Typography variant="body2" color={colorScheme.green.primary}>
                  The ticket from TicketExpert is an electronic ticket and will be delivered to your email address.
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <QrCode2Icon sx={{ color: colorScheme.green.primary, mt: 0.5 }} />
              <Box>
                <Typography fontWeight={600} color="black">Present your ticket QR code to event staff</Typography>
                <br/>
                <Typography variant="body2" color={colorScheme.green.primary}>
                  Please show your ticket when attending the event. The staff can scan your ticket.
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <AutorenewIcon sx={{ color: colorScheme.green.primary, mt: 0.5 }} />
              <Box>
                <Typography fontWeight={600} color="black">No problem with changing mind!</Typography>
                <br/>
                <Typography variant="body2" color={colorScheme.green.primary}>
                  Return your ticket within 7 days from the day you purchase.
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <VerifiedUserIcon sx={{ color: colorScheme.green.primary, mt: 0.5 }} />
              <Box>
                <Typography fontWeight={600} color="black">Our guarantee</Typography>
                <br/>
                <Typography variant="body2" color={colorScheme.green.primary}>
                  All the ticket is protected. If your event gets cancelled, we are here to help.
                </Typography>
              </Box>
            </Stack>
            {event.refundPolicy && (
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <CheckCircleIcon sx={{ color: colorScheme.green.primary, mt: 0.5 }} />
                <Box>
                  <Typography fontWeight={600} color="black">Refund Policy</Typography>
                  <br/>
                  <Typography variant="body2" color={colorScheme.green.primary}>{event.refundPolicy}</Typography>
                </Box>
              </Stack>
            )}
          </Stack>
        </Paper>

    
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Tickets added to cart!"
      />
    </Box>
  );
}