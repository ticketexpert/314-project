import React, { useState } from 'react';
import {
  Box, Container, Typography, Paper, Stack, TextField,
  Checkbox, FormControlLabel, Button, Divider, Grid, Chip, Link,
  Stepper, Step, StepLabel, CircularProgress, Alert, Tooltip, IconButton,
  Radio, RadioGroup, FormControl, FormLabel, InputAdornment,
  Skeleton, Snackbar
} from '@mui/material';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { validateCardNumber, getCardType, formatCardNumber } from '../../services/paymentService';
import { getPaymentMethods, savePaymentMethod } from '../../services/paymentService';
import visaLogo from '../../assets/visa.png';
import mastercardLogo from '../../assets/Mastercard.png';
import amexLogo from '../../assets/Amex.png';

const colorScheme = {
  red: {
    primary: '#9F1B32',
    light: '#fbe9eb',
    hover: '#7f1628'
  },
  blue: {
    primary: '#034AA6',
    light: '#e6f0ff',
    hover: '#023b88'
  },
  green: {
    primary: '#166534',
    light: '#e6f4ea',
    hover: '#14532d'
  },
  grey: {
    border: '#E0E0E0',
    divider: '#E0E0E0',
    background: '#f7f8fa',
    text: '#333'
  }
};

const steps = ['Contact Information', 'Ticket Details', 'Review & Payment'];
let pageOrderNumber = 0;

// Add payment methods data
const paymentMethods = [
  {
    id: 'credit',
    name: 'Credit Card',
    icon: '💳',
    description: 'Pay with Visa, Mastercard, or American Express'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🔒',
    description: 'Pay securely with your PayPal account'
  }
];

function flattenTickets(cartItems) {
  // Returns an array of { event, ticketType, ticket, eventImage, eventTitle, eventDate, eventVenue }
  const result = [];
  cartItems.forEach((item, eventIndex) => {
    Object.entries(item.tickets).forEach(([type, ticket]) => {
      for (let i = 0; i < ticket.quantity; i++) {
        result.push({
          eventId: item.eventId,
          eventIndex: eventIndex,
          eventImage: item.eventImage,
          eventTitle: item.eventTitle,
          eventDate: item.eventDate,
          eventVenue: item.eventVenue,
          eventCategory: item.eventCategory,
          ticketType: type,
          ticketPrice: ticket.price,
        });
      }
    });
  });
  return result;
}

// Update groupTicketsByEvent to maintain event order
function groupTicketsByEvent(tickets) {
  const groupedTickets = {};
  tickets.forEach(ticket => {
    const key = `${ticket.eventIndex}-${ticket.eventId}`; // Use combined key to maintain order
    if (!groupedTickets[key]) {
      groupedTickets[key] = {
        eventId: ticket.eventId,
        eventIndex: ticket.eventIndex,
        eventTitle: ticket.eventTitle,
        eventImage: ticket.eventImage,
        eventDate: ticket.eventDate,
        eventVenue: ticket.eventVenue,
        eventCategory: ticket.eventCategory,
        tickets: []
      };
    }
    groupedTickets[key].tickets.push(ticket);
  });
  return groupedTickets;
}

const formFieldSx = {
  bgcolor: '#fff',
  borderRadius: 3,
  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: colorScheme.grey.border,
    },
    '&:hover fieldset': {
      borderColor: colorScheme.red.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: colorScheme.red.primary,
      boxShadow: '0 0 0 2px rgba(159,27,50,0.08)'
    },
  },
};

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const tickets = flattenTickets(cartItems);
  const isCartEmpty = !cartItems || cartItems.length === 0;

  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    keepUpdated: false
  });
  const [ticketHolders, setTicketHolders] = useState(() => {
    const holders = {};
    tickets.forEach((ticket, idx) => {
      const key = `${ticket.eventIndex}-${ticket.eventId}-${idx}`;
      holders[key] = {
        firstName: '',
        lastName: '',
        email: '',
        acceptTerms: false
      };
    });
    return holders;
  });
  const [promo, setPromo] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [cardValidation, setCardValidation] = useState({
    number: { isValid: true, message: '' },
    expiry: { isValid: true, message: '' },
    cvc: { isValid: true, message: '' },
    name: { isValid: true, message: '' }
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  // Get card brand logo
  const getCardBrandLogo = (cardType) => {
    switch (cardType) {
      case 'visa': return visaLogo;
      case 'mastercard': return mastercardLogo;
      case 'amex': return amexLogo;
      default: return null;
    }
  };

  // Enhanced card validation
  const validateCardDetails = () => {
    const errors = {
      number: { isValid: true, message: '' },
      expiry: { isValid: true, message: '' },
      cvc: { isValid: true, message: '' },
      name: { isValid: true, message: '' }
    };

    // Card number validation
    if (!cardDetails.number) {
      errors.number = { isValid: false, message: 'Card number is required' };
    } else if (!validateCardNumber(cardDetails.number)) {
      errors.number = { isValid: false, message: 'Invalid card number' };
    }

    // Expiry date validation
    if (!cardDetails.expiry) {
      errors.expiry = { isValid: false, message: 'Expiry date is required' };
    } else {
      const [month, year] = cardDetails.expiry.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (month < 1 || month > 12) {
        errors.expiry = { isValid: false, message: 'Invalid month' };
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiry = { isValid: false, message: 'Card has expired' };
      }
    }

    // CVC validation
    if (!cardDetails.cvc) {
      errors.cvc = { isValid: false, message: 'CVC is required' };
    } else if (cardDetails.cvc.length < 3 || cardDetails.cvc.length > 4) {
      errors.cvc = { isValid: false, message: 'Invalid CVC' };
    }

    // Name validation
    if (!cardDetails.name) {
      errors.name = { isValid: false, message: 'Name is required' };
    }

    setCardValidation(errors);
    return Object.values(errors).every(error => error.isValid);
  };

  // Enhanced card details change handler
  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    // Format expiry date
    else if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .substring(0, 5);
    }
    // Format CVC
    else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear validation error when user starts typing
    if (cardValidation[name]) {
      setCardValidation(prev => ({
        ...prev,
        [name]: { isValid: true, message: '' }
      }));
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!contact.firstName) errors.contactFirstName = 'First name is required';
      if (!contact.lastName) errors.contactLastName = 'Last name is required';
      if (!contact.email) {
        errors.contactEmail = 'Email is required';
      } else if (!validateEmail(contact.email)) {
        errors.contactEmail = 'Invalid email format';
      }
    }
    
    if (step === 1) {
      Object.entries(groupTicketsByEvent(tickets)).forEach(([eventKey, eventData]) => {
        eventData.tickets.forEach((ticket, idx) => {
          const holderKey = `${eventKey}-${idx}`;
          const holder = ticketHolders[holderKey];
          if (!holder.firstName) errors[`ticket${holderKey}FirstName`] = 'First name is required';
          if (!holder.lastName) errors[`ticket${holderKey}LastName`] = 'Last name is required';
          if (!holder.email) {
            errors[`ticket${holderKey}Email`] = 'Email is required';
          } else if (!validateEmail(holder.email)) {
            errors[`ticket${holderKey}Email`] = 'Invalid email format';
          }
          if (!holder.acceptTerms) errors[`ticket${holderKey}Terms`] = 'Terms must be accepted';
        });
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleContactChange = e => {
    const { name, value, checked, type } = e.target;
    setContact(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field is modified
    if (formErrors[`contact${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setFormErrors(prev => ({
        ...prev,
        [`contact${name.charAt(0).toUpperCase() + name.slice(1)}`]: undefined
      }));
    }
    // Prefill ticket holders if empty
    if (["firstName", "lastName", "email"].includes(name)) {
      setTicketHolders(ths => {
        const updated = { ...ths };
        Object.keys(updated).forEach(key => {
          if (updated[key][name] === '') {
            updated[key][name] = value;
          }
        });
        return updated;
      });
    }
  };

  const handleTicketHolderChange = (eventKey, ticketIdx, e) => {
    const { name, value, checked, type } = e.target;
    setTicketHolders(prev => ({
      ...prev,
      [`${eventKey}-${ticketIdx}`]: {
        ...prev[`${eventKey}-${ticketIdx}`],
        [name]: type === 'checkbox' ? checked : value
      }
    }));
    // Clear error when field is modified
    if (formErrors[`ticket${eventKey}-${ticketIdx}${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setFormErrors(prev => ({
        ...prev,
        [`ticket${eventKey}-${ticketIdx}${name.charAt(0).toUpperCase() + name.slice(1)}`]: undefined
      }));
    }
  };

  // Add payment method handlers
  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  // Handle promo code application
  const handlePromoApply = () => {
    if (!promo) {
      setSnackbar({
        open: true,
        message: 'Please enter a promotion code',
        severity: 'warning'
      });
      return;
    }
    // TODO: Implement actual promo code validation
    setPromoApplied(true);
    setSnackbar({
      open: true,
      message: 'Promotion code applied successfully!',
      severity: 'success'
    });
  };

  // Add function to create tickets
  const createTickets = async (orderData) => {
    try {
      const userId = localStorage.getItem('userId'); // Get current user's ID
      if (!userId) {
        throw new Error('User not logged in');
      }

      // Generate order number from timestamp
      const orderNumber = Date.now().toString();
      pageOrderNumber = orderNumber;


      // Create tickets for each cart item
      for (const item of orderData.cartItems) {
        for (const [ticketType, ticketInfo] of Object.entries(item.tickets)) {
          for (let i = 0; i < ticketInfo.quantity; i++) {
            // Generate random 6-letter ticket ID
            const ticketId = Array.from({length: 6}, () => 
              String.fromCharCode(65 + Math.floor(Math.random() * 26))
            ).join('');

            const ticketData = {
              ticketId: ticketId,
              eventId: Number(item.eventId),
              userId: Number(userId),
              ticketType: ticketType,
              ticketStatus: 'active',
              locationDetails: {
                section: ticketType,
                row: 'None',
                seat: `${i + 1}`
              },
              orderNumber: orderNumber
            };

            const response = await fetch('https://api.ticketexpert.me/api/tickets', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(ticketData)
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to create ticket: ${response.statusText} - ${errorText}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error creating tickets:', error);
      throw error;
    }
  };

  // Enhanced submit handler with ticket creation
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    setIsProcessingPayment(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        contact,
        cartItems,
        pageOrderNumber,
        total: getCartTotal(),
        date: new Date().toISOString()
      };

      // Store order summary in localStorage before payment processing
      localStorage.setItem('orderSummary', JSON.stringify(orderData));

      if (selectedPaymentMethod === 'credit') {
        if (!validateCardDetails()) {
          setIsProcessingPayment(false);
          return;
        }

        // Prepare payment data with only necessary information
        const paymentData = {
          amount: getCartTotal(),
          cardNumber: cardDetails.number.replace(/\s/g, ''), // Remove spaces from card number
          cardName: cardDetails.name,
          cardExpiry: cardDetails.expiry,
          cardCvc: cardDetails.cvc
        };

        const response = await fetch('https://api.ticketexpert.me/api/paymentsGateway', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData)
        });

        const data = await response.json();
        console.log(data);
        if (data.Success == "Success") {
          setSnackbar({
            open: true,
            message: 'Payment processed successfully!',
            severity: 'success'
          });
        } else {
          throw new Error('Payment processing failed');
        }
      }

      // Handle PayPal payment
      if (selectedPaymentMethod === 'paypal') {
        // Simulate successful PayPal payment
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSnackbar({
          open: true,
          message: 'PayPal payment processed successfully!',
          severity: 'success'
        });
      }

      // Create tickets after successful payment
      await createTickets(orderData);

      // Clear the cart after successful checkout
      clearCart();

      // Navigate to success page
      navigate('/checkout/success');
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred during payment processing. Please try again.');
      setSnackbar({
        open: true,
        message: err.message || 'Payment failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  if (isCartEmpty) {
    return (
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={2} sx={{ p: 6, borderRadius: 4, textAlign: 'center', bgcolor: colorScheme.blue.light }}>
            <Typography variant="h4" color={colorScheme.blue.primary} gutterBottom fontWeight="bold">
              Your Cart is Empty
            </Typography>
            <br/>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Add tickets to your cart to start the checkout process.
            </Typography>
            <br/>
            <br/>
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
                boxShadow: '0 4px 12px rgba(85, 193, 255, 0.15)',
                '&:hover': {
                  bgcolor: colorScheme.blue.hover,
                  boxShadow: '0 6px 16px rgba(113, 170, 255, 0.2)'
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
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Progress Stepper with improved mobile view */}
        <Box sx={{ 
          mb: 4, 
          display: { xs: 'none', md: 'block' },
          position: 'sticky',
          top: 0,
          bgcolor: 'white',
          zIndex: 1,
          pt: 2,
          pb: 1,
          borderBottom: `1px solid ${colorScheme.grey.divider}`
        }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: 700,
                    color: colorScheme.red.primary,
                  },
                  '& .MuiStepIcon-root': {
                    color: colorScheme.red.light,
                    '&.Mui-active': { color: colorScheme.red.primary },
                    '&.Mui-completed': { color: colorScheme.green.primary },
                  }
                }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Mobile Progress Indicator */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          mb: 3,
          alignItems: 'center',
          gap: 1,
          borderBottom: `1px solid ${colorScheme.grey.divider}`,
          pb: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Step {activeStep + 1} of {steps.length}:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {steps[activeStep]}
          </Typography>
        </Box>

        <Grid container spacing={5}>
          {/* Left: Event info, contact, ticket holders */}
          <Grid item xs={12} md={7} lg={8}>
            <Box sx={{ px: { xs: 0, md: 2 }, pb: 4 }}>
              {/* Back link with improved hover state */}
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ 
                  color: colorScheme.red.primary, 
                  fontWeight: 600, 
                  mb: 2, 
                  fontSize: 16,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: colorScheme.red.light,
                    transform: 'translateX(-4px)'
                  }
                }}
              >
                Back
              </Button>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    animation: 'fadeIn 0.3s ease-in-out'
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Event info card - support multiple events */}
              {cartItems.length > 1 ? (
                <Stack spacing={2} mb={3}>
                  {cartItems.map((evt, idx) => (
                    <Paper key={evt.eventId || idx} elevation={2} sx={{ p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" mb={1} flexWrap="wrap">
                        <Chip label={evt.eventCategory || 'Event'} size="small" sx={{ bgcolor: colorScheme.green.light, color: colorScheme.green.primary, fontWeight: 600 }} />
                        <Chip label={new Date(evt.eventDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} size="small" sx={{ bgcolor: colorScheme.blue.light, color: colorScheme.blue.primary, fontWeight: 600 }} />
                        <Chip label={evt.eventVenue} size="small" sx={{ bgcolor: colorScheme.red.light, color: colorScheme.red.primary, fontWeight: 600 }} />
                      </Stack>
                      <Typography variant="h5" fontWeight={700} color={colorScheme.red.primary} sx={{ mb: 0.5 }}>
                        {evt.eventTitle}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1} flexWrap="wrap">
                    <Chip label={event.eventCategory || 'Event'} size="small" sx={{ bgcolor: colorScheme.green.light, color: colorScheme.green.primary, fontWeight: 600 }} />
                    <Chip label={new Date(event.eventDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} size="small" sx={{ bgcolor: colorScheme.blue.light, color: colorScheme.blue.primary, fontWeight: 600 }} />
                    <Chip label={event.eventVenue} size="small" sx={{ bgcolor: colorScheme.red.light, color: colorScheme.red.primary, fontWeight: 600 }} />
                  </Stack>
                  <Typography variant="h5" fontWeight={700} color={colorScheme.red.primary} sx={{ mb: 0.5 }}>
                    {event.eventTitle}
                  </Typography>
                </Paper>
              )}

              {/* Contact info */}
              {activeStep === 0 && (
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 3, bgcolor: colorScheme.grey.background, boxShadow: '0 2px 12px rgba(159,27,50,0.04)' }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 3, color: colorScheme.red.primary, letterSpacing: 0.5 }}>
                    Contact Information
                  </Typography>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={contact.firstName}
                        onChange={handleContactChange}
                        required
                        variant="outlined"
                        error={!!formErrors.contactFirstName}
                        helperText={formErrors.contactFirstName}
                        sx={formFieldSx}
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={contact.lastName}
                        onChange={handleContactChange}
                        required
                        variant="outlined"
                        error={!!formErrors.contactLastName}
                        helperText={formErrors.contactLastName}
                        sx={formFieldSx}
                      />
                    </Stack>
                    <TextField
                      fullWidth
                      label="Email address"
                      name="email"
                      value={contact.email}
                      onChange={handleContactChange}
                      required
                      variant="outlined"
                      error={!!formErrors.contactEmail}
                      helperText={formErrors.contactEmail}
                      sx={formFieldSx}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={contact.phone || ''}
                      onChange={handleContactChange}
                      variant="outlined"
                      sx={formFieldSx}
                    />
                  </Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="keepUpdated"
                        checked={contact.keepUpdated}
                        onChange={handleContactChange}
                        sx={{
                          color: colorScheme.red.primary,
                          '&.Mui-checked': {
                            color: colorScheme.red.primary,
                          },
                          mr: 1
                        }}
                      />
                    }
                    label={<Typography sx={{ color: colorScheme.grey.text, fontSize: 15 }}>Keep me updated on more events and news from this event organiser.</Typography>}
                    sx={{ mt: 2, mb: 2, alignItems: 'flex-start' }}
                  />
                </Paper>
              )}

              {/* Ticket holders */}
              {activeStep === 1 && (
                <Stack spacing={3}>
                  {tickets.length === 0 ? (
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No tickets selected. Please add tickets to your cart.
                      </Typography>
                    </Paper>
                  ) : (
                    Object.entries(groupTicketsByEvent(tickets)).map(([eventKey, eventData], eventIdx, arr) => (
                      <Paper key={eventKey} elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: colorScheme.grey.background, boxShadow: '0 2px 12px rgba(159,27,50,0.04)' }}>
                        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={eventData.eventImage}
                            alt={eventData.eventTitle}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 2,
                              boxShadow: '0 2px 8px rgba(3,74,166,0.08)'
                            }}
                          />
                          <Box>
                            <Typography variant="h6" fontWeight={800} color={colorScheme.red.primary}>
                              {eventData.eventTitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(eventData.eventDate).toLocaleDateString(undefined, { 
                                weekday: 'long',
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                              })}
                            </Typography> <br/>
                            <Typography variant="body2" color="text.secondary">
                              {eventData.eventVenue}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        {eventData.tickets.length === 0 ? (
                          <Stack spacing={2}>
                            {[...Array(2)].map((_, idx) => (
                              <Skeleton key={idx} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                            ))}
                          </Stack>
                        ) : (
                          eventData.tickets.map((ticket, idx) => (
                            <Box key={idx} sx={{ mb: 3 }}>
                              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: colorScheme.blue.primary }}>
                                Ticket {idx + 1} | <span style={{ fontWeight: 400 }}>{ticket.ticketType} Ticket</span>
                              </Typography>
                              <Stack spacing={3}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                  <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    onChange={e => handleTicketHolderChange(eventKey, idx, e)}
                                    required
                                    variant="outlined"
                                    error={!!formErrors[`ticket${eventKey}-${idx}FirstName`]}
                                    helperText={formErrors[`ticket${eventKey}-${idx}FirstName`]}
                                    sx={formFieldSx}
                                  />
                                  <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    onChange={e => handleTicketHolderChange(eventKey, idx, e)}
                                    required
                                    variant="outlined"
                                    error={!!formErrors[`ticket${eventKey}-${idx}LastName`]}
                                    helperText={formErrors[`ticket${eventKey}-${idx}LastName`]}
                                    sx={formFieldSx}
                                  />
                                </Stack>
                                <TextField
                                  fullWidth
                                  label="Email address"
                                  name="email"
                                  onChange={e => handleTicketHolderChange(eventKey, idx, e)}
                                  required
                                  variant="outlined"
                                  error={!!formErrors[`ticket${eventKey}-${idx}Email`]}
                                  helperText={formErrors[`ticket${eventKey}-${idx}Email`]}
                                  sx={formFieldSx}
                                />
                                <TextField
                                  fullWidth
                                  label="Phone Number"
                                  name="phone"
                                  onChange={e => handleTicketHolderChange(eventKey, idx, e)}
                                  variant="outlined"
                                  sx={formFieldSx}
                                />
                              </Stack>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="acceptTerms"
                                    checked={ticketHolders[`${eventKey}-${idx}`]?.acceptTerms || false}
                                    onChange={e => handleTicketHolderChange(eventKey, idx, e)}
                                    sx={{
                                      color: colorScheme.red.primary,
                                      '&.Mui-checked': {
                                        color: colorScheme.red.primary,
                                      },
                                      mr: 1
                                    }}
                                  />
                                }
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ color: colorScheme.grey.text, fontSize: 15 }}>
                                      I accept the TicketExpert Terms of Service and Privacy Policy.
                                    </Typography>
                                    <Tooltip title="By accepting these terms, you agree to our service conditions and data handling policies.">
                                      <IconButton size="small" sx={{ ml: 1 }}>
                                        <InfoOutlinedIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                }
                                sx={{ mt: 1, alignItems: 'flex-start' }}
                              />
                              {formErrors[`ticket${eventKey}-${idx}Terms`] && (
                                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                                  {formErrors[`ticket${eventKey}-${idx}Terms`]}
                                </Typography>
                              )}
                            </Box>
                          ))
                        )}
                        {/* Divider between events, not tickets */}
                        {arr.length > 1 && eventIdx < arr.length - 1 && (
                          <Divider sx={{ my: 2, borderColor: colorScheme.grey.divider }} />
                        )}
                      </Paper>
                    ))
                  )}
                </Stack>
              )}

              {/* Review & Payment */}
              {activeStep === 2 && (
                <Stack spacing={3}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      Order Review
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Contact Information
                        </Typography>
                        <Typography variant="body1">
                          {contact.firstName} {contact.lastName}
                        </Typography>
                        <br/>
                        <Typography variant="body1" color="text.secondary">
                          {contact.email}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Ticket Holders
                        </Typography>
                        {Object.entries(groupTicketsByEvent(tickets)).map(([eventKey, eventData]) => (
                          <Box key={eventKey} sx={{ mb: 1 }}>
                            <Typography variant="body1">
                              {eventData.tickets.map((ticket, idx) => (
                                <Typography key={`${eventKey}-${idx}`} variant="body2" color="text.secondary">
                                  {ticket.firstName} {ticket.lastName}
                                </Typography>
                              ))}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Event Details
                        </Typography>
                        {Object.entries(groupTicketsByEvent(tickets)).map(([eventKey, eventData]) => (
                          <Typography key={eventKey} variant="body1">
                            {eventData.eventTitle}
                          </Typography>
                        ))}
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Payment Method Selection */}
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      Payment Method
                    </Typography>
                    <Stack spacing={2}>
                      {paymentMethods.map((method) => (
                        <Paper
                          key={method.id}
                          elevation={selectedPaymentMethod === method.id ? 2 : 0}
                          sx={{
                            p: 2,
                            border: 2,
                            borderColor: selectedPaymentMethod === method.id ? colorScheme.red.primary : colorScheme.grey.border,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: colorScheme.red.primary,
                              bgcolor: colorScheme.red.light,
                              transform: 'translateY(-2px)'
                            }
                          }}
                          onClick={() => handlePaymentMethodChange(method.id)}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            {method.id === 'credit' ? <CreditCardIcon /> : <LockIcon />}
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {method.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {method.description}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      ))}

                      {/* Credit Card Form */}
                      {selectedPaymentMethod === 'credit' && (
                        <Box sx={{ mt: 2 }}>
                          <Stack spacing={3}>
                            {/* Card Number Row */}
                            <TextField
                              fullWidth
                              label="Card Number"
                              name="number"
                              value={cardDetails.number}
                              onChange={handleCardDetailsChange}
                              placeholder="1234 5678 9012 3456"
                              error={!cardValidation.number.isValid}
                              helperText={cardValidation.number.message}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    {cardDetails.number && (
                                      <img
                                        src={getCardBrandLogo(getCardType(cardDetails.number))}
                                        alt="card type"
                                        style={{ height: 24 }}
                                      />
                                    )}
                                  </InputAdornment>
                                )
                              }}
                              sx={{
                                bgcolor: '#fff',
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: colorScheme.grey.border,
                                  },
                                  '&:hover fieldset': {
                                    borderColor: colorScheme.red.primary,
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: colorScheme.red.primary,
                                  },
                                },
                              }}
                            />

                            {/* Name on Card Row */}
                            <TextField
                              fullWidth
                              label="Name on Card"
                              name="name"
                              value={cardDetails.name}
                              onChange={handleCardDetailsChange}
                              placeholder="Adam Smith"
                              error={!cardValidation.name.isValid}
                              helperText={cardValidation.name.message}
                              sx={{
                                bgcolor: '#fff',
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: colorScheme.grey.border,
                                  },
                                  '&:hover fieldset': {
                                    borderColor: colorScheme.red.primary,
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: colorScheme.red.primary,
                                  },
                                },
                              }}
                            />

                            {/* Expiry and CVC Row */}
                            <Grid container spacing={2}>
                              <Grid item xs={8}>
                                <TextField
                                  fullWidth
                                  label="Expiry Date"
                                  name="expiry"
                                  value={cardDetails.expiry}
                                  onChange={handleCardDetailsChange}
                                  placeholder="MM/YY"
                                  error={!cardValidation.expiry.isValid}
                                  helperText={cardValidation.expiry.message}
                                  sx={{
                                    bgcolor: '#fff',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                      '& fieldset': {
                                        borderColor: colorScheme.grey.border,
                                      },
                                      '&:hover fieldset': {
                                        borderColor: colorScheme.red.primary,
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: colorScheme.red.primary,
                                      },
                                    },
                                  }}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  fullWidth
                                  label="CVC"
                                  name="cvc"
                                  value={cardDetails.cvc}
                                  onChange={handleCardDetailsChange}
                                  placeholder="123"
                                  error={!cardValidation.cvc.isValid}
                                  helperText={cardValidation.cvc.message}
                                  sx={{
                                    bgcolor: '#fff',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                      '& fieldset': {
                                        borderColor: colorScheme.grey.border,
                                      },
                                      '&:hover fieldset': {
                                        borderColor: colorScheme.red.primary,
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: colorScheme.red.primary,
                                      },
                                    },
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Stack>
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              We accept:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <img src={visaLogo} alt="Visa" style={{ height: 20 }} />
                              <img src={mastercardLogo} alt="Mastercard" style={{ height: 20 }} />
                              <img src={amexLogo} alt="Amex" style={{ height: 20 }} />
                            </Box>
                          </Box>
                        </Box>
                      )}

                      {/* Enhanced PayPal Button */}
                      {selectedPaymentMethod === 'paypal' && (
                        <Box sx={{ 
                          mt: 2, 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            You will be redirected to PayPal to complete your payment securely
                          </Typography>
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: '#0070BA',
                              py: 1.5,
                              px: 4,
                              borderRadius: 2,
                              minWidth: 200,
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: '#005EA6',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,112,186,0.2)'
                              }
                            }}
                          >
                            Continue with PayPal
                          </Button>
                          <Typography variant="caption" color="text.secondary" align="center">
                            By continuing, you agree to PayPal's Terms of Service
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Stack>
              )}

              {/* Navigation buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{
                    color: colorScheme.red.primary,
                    '&:hover': {
                      bgcolor: colorScheme.red.light
                    }
                  }}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      bgcolor: colorScheme.red.primary,
                      borderRadius: 99,
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 12px rgba(159,27,50,0.15)',
                      '&:hover': {
                        bgcolor: colorScheme.red.hover,
                        boxShadow: '0 6px 16px rgba(159,27,50,0.2)'
                      },
                      '&.Mui-disabled': {
                        bgcolor: colorScheme.grey.border,
                        color: colorScheme.grey.text
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Process to payment'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      bgcolor: colorScheme.red.primary,
                      borderRadius: 99,
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 12px rgba(159,27,50,0.15)',
                      '&:hover': {
                        bgcolor: colorScheme.red.hover,
                        boxShadow: '0 6px 16px rgba(159,27,50,0.2)'
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Right: Enhanced Order Summary */}
          <Grid item xs={12} md={5} lg={4}>
            <Box sx={{ p: { xs: 0, md: 0 }, pt: { xs: 4, md: 0 } }}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                borderRadius: 4, 
                bgcolor: '#fff', 
                color: colorScheme.red.primary, 
                boxShadow: '0 2px 8px rgba(22,101,52,0.08)',
                maxWidth: 320,
                mx: 'auto',
                position: 'sticky',
                top: 100
              }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: colorScheme.red.primary }}>
                  Order Summary
                </Typography>
                {Object.entries(groupTicketsByEvent(tickets)).map(([eventKey, eventData], eventIdx, arr) => {
                  // Calculate event subtotal
                  const eventSubtotal = eventData.tickets.reduce((sum, ticket) => sum + ticket.ticketPrice, 0);
                  return (
                    <Box key={eventKey} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box
                          component="img"
                          src={eventData.eventImage}
                          alt={eventData.eventTitle}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ color: colorScheme.red.primary }}>
                            {eventData.eventTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(eventData.eventDate).toLocaleDateString(undefined, { 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Box>
                      <Stack spacing={1}>
                        {eventData.tickets.length === 0 ? (
                          <Stack spacing={2}>
                            {[...Array(2)].map((_, idx) => (
                              <Skeleton key={idx} variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
                            ))}
                          </Stack>
                        ) : (
                          eventData.tickets.map((ticket, idx) => (
                            <Box key={idx} sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              fontSize: '0.9rem',
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: colorScheme.grey.background,
                                borderRadius: 1,
                                px: 1
                              }
                            }}>
                              <Typography variant="body2" sx={{ color: colorScheme.red.primary }}>
                                1 x {ticket.ticketType} Ticket
                              </Typography>
                              <Typography variant="body2" sx={{ color: colorScheme.red.primary, fontWeight: 600 }}>
                                ${ticket.ticketPrice.toFixed(2)}
                              </Typography>
                            </Box>
                          ))
                        )}
                      </Stack>
                      {/* Event subtotal */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ color: colorScheme.red.primary }}>
                          Event Subtotal
                        </Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: colorScheme.red.primary }}>
                          ${eventSubtotal.toFixed(2)}
                        </Typography>
                      </Box>
                      {/* Divider between events, not tickets */}
                      {arr.length > 1 && eventIdx < arr.length - 1 && (
                        <Divider sx={{ my: 2, borderColor: colorScheme.grey.divider }} />
                      )}
                    </Box>
                  );
                })}
                <Divider sx={{ my: 2, borderColor: colorScheme.grey.divider }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2 
                }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: colorScheme.red.primary }}>Total</Typography>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: colorScheme.red.primary }}>${getCartTotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Have a promotion code?"
                    value={promo}
                    onChange={e => setPromo(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalOfferIcon sx={{ color: colorScheme.grey.text, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: promo && (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            onClick={handlePromoApply}
                            disabled={promoApplied}
                            sx={{ 
                              color: promoApplied ? 'success.main' : colorScheme.red.primary,
                              '&:hover': {
                                bgcolor: colorScheme.red.light
                              }
                            }}
                          >
                            {promoApplied ? 'Applied' : 'Apply'}
                          </Button>
                        </InputAdornment>
                      )
                    }}
                    sx={{ 
                      bgcolor: colorScheme.grey.background, 
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                </Box>
                <Box sx={{ 
                  mt: 2, 
                  p: 1.5, 
                  bgcolor: colorScheme.grey.background, 
                  borderRadius: 2,
                  fontSize: '0.8rem'
                }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <SecurityIcon sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      Your payment is secured with SSL encryption
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Checkout;
