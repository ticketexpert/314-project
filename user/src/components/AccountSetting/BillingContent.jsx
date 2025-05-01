import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography, Divider, Snackbar, Alert } from "@mui/material";
import PaymentMethodPopup from './PaymentMethodPopup';

export default function BillingContent() {
  const [address, setAddress] = useState({
    address1: "10 Steel Street",
    address2: "",
    city: "Figtree",
    postcode: "2525",
    state: "NSW",
    country: "Australia",
  });

  const [cards, setCards] = useState([
    {
      id: 1,
      cardNumber: "0123 **** **** 4567",
      cardHolder: "MATTHEW GALE",
      expiryDate: "12/25",
      cvv: "123",
    },
    {
      id: 2,
      cardNumber: "0123 **** **** 8910",
      cardHolder: "MATTHEW GALE",
      expiryDate: "03/26",
      cvv: "456",
    },
  ]);

  const [selectedCard, setSelectedCard] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState('view');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const validateCard = (card) => {
    // Card number validation (Luhn algorithm)
    const cardNumber = card.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
      return { isValid: false, message: 'Card number must be 16 digits' };
    }

    // Card holder validation
    if (!card.cardHolder.trim()) {
      return { isValid: false, message: 'Card holder name is required' };
    }

    // Expiry date validation
    const [month, year] = card.expiryDate.split('/');
    if (!/^\d{2}\/\d{2}$/.test(card.expiryDate)) {
      return { isValid: false, message: 'Expiry date must be in MM/YY format' };
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return { isValid: false, message: 'Card has expired' };
    }

    // CVV validation
    if (!/^\d{3,4}$/.test(card.cvv)) {
      return { isValid: false, message: 'CVV must be 3 or 4 digits' };
    }

    return { isValid: true };
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setPopupMode('view');
    setPopupOpen(true);
  };

  const handleAddCard = () => {
    setSelectedCard({
      id: null,
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    });
    setPopupMode('add');
    setPopupOpen(true);
  };

  const handleUpdateCard = (card, mode = 'edit') => {
    if (mode === 'edit') {
      setSelectedCard(card);
      setPopupMode('edit');
      setPopupOpen(true);
    } else if (mode === 'add') {
      const validation = validateCard(card);
      if (!validation.isValid) {
        setNotification({
          open: true,
          message: validation.message,
          severity: 'error'
        });
        return;
      }

      // Format card number to show only last 4 digits
      const formattedCardNumber = card.cardNumber.replace(/\d(?=\d{4})/g, '*');
      
      const newCard = {
        ...card,
        id: cards.length + 1,
        cardNumber: formattedCardNumber
      };
      
      setCards([...cards, newCard]);
      setPopupOpen(false);
      setNotification({
        open: true,
        message: 'Card added successfully',
        severity: 'success'
      });
    } else {
      const updatedCards = cards.map(c => 
        c.id === card.id ? card : c
      );
      setCards(updatedCards);
    }
  };

  const handleDeleteCard = (card) => {
    setCards(cards.filter(c => c.id !== card.id));
    setPopupOpen(false);
    setNotification({
      open: true,
      message: 'Card deleted successfully',
      severity: 'success'
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#166534',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#166534',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#166534',
    },
  };

  return (
    <Box width="100%">
      <Typography variant="h4" fontWeight="bold" mb={4} color="#166534">
        Payment and Billing Address
      </Typography>

      {/* Payment Methods */}
      <Typography variant="h6" mb={2}>
        Saved Payment Method
      </Typography>

      {cards.map((card) => (
        <Paper 
          key={card.id} 
          elevation={2} 
          sx={{ p: 2, mb: 2, cursor: 'pointer' }}
          onClick={() => handleCardClick(card)}
        >
          <Typography>💳 {card.cardNumber} — {card.cardHolder}</Typography>
        </Paper>
      ))}

      <Button
        variant="contained"
        sx={{ backgroundColor: "#166534", mb: 4 }}
        onClick={handleAddCard}
      >
        Add your card
      </Button>

      <PaymentMethodPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        card={selectedCard}
        onUpdate={handleUpdateCard}
        onDelete={() => handleDeleteCard(selectedCard)}
        mode={popupMode}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Divider sx={{ my: 4 }} />

      {/* Billing Address */}
      <Typography variant="h6" mb={2}>
        Billing Address
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Address Line 1 (required)"
          fullWidth
          name="address1"
          value={address.address1}
          onChange={handleChange}
          sx={textFieldStyles}
        />
        <TextField
          label="Address Line 2 (optional)"
          fullWidth
          name="address2"
          value={address.address2}
          onChange={handleChange}
          sx={textFieldStyles}
        />
        <Box display="flex" gap={2}>
          <TextField
            label="Suburb / City"
            fullWidth
            name="city"
            value={address.city}
            onChange={handleChange}
            sx={textFieldStyles}
          />
          <TextField
            label="Postcode"
            fullWidth
            name="postcode"
            value={address.postcode}
            onChange={handleChange}
            sx={textFieldStyles}
          />
        </Box>
        <Box display="flex" gap={2}>
          <TextField
            label="State"
            fullWidth
            name="state"
            value={address.state}
            onChange={handleChange}
            sx={textFieldStyles}
          />
          <TextField
            label="Country"
            fullWidth
            name="country"
            value={address.country}
            onChange={handleChange}
            sx={textFieldStyles}
          />
        </Box>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#166534", mt: 2 }}
        >
          Save Address
        </Button>
      </Box>
    </Box>
  );
}
