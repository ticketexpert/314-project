import React, { useState, useEffect } from "react";
import {
  Box, Button, Paper, TextField, Typography,
  Divider, Snackbar, Alert, Avatar, Stack, IconButton, Tooltip
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PaymentMethodPopup from './PaymentMethodPopup';
import { getCards, saveCard, updateCard, deleteCard, maskCardNumber } from '../../data/cards';
import visaLogo from '../../assets/visa.png';
import mastercardLogo from '../../assets/Mastercard.png';
import amexLogo from '../../assets/Amex.png';

export default function BillingContent() {
  const [address, setAddress] = useState({
    address1: "10 Steel Street",
    address2: "",
    city: "Figtree",
    postcode: "2525",
    state: "NSW",
    country: "Australia",
  });

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState('view');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Load cards on component mount
  useEffect(() => {
    const loadedCards = getCards();
    setCards(loadedCards);
  }, []);

  const getBrandLogo = (cardType) => {
    switch (cardType) {
      case 'visa': return visaLogo;
      case 'mastercard': return mastercardLogo;
      case 'amex': return amexLogo;
      default: return null;
    }
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
    setSelectedCard(null);
    setPopupMode('add');
    setPopupOpen(true);
  };

  const handleUpdateCard = (cardData, mode) => {
    try {
      if (mode === 'add') {
        const newCard = saveCard(cardData);
        setCards(prevCards => [...prevCards, newCard]);
        setNotification({ open: true, message: 'Card added successfully', severity: 'success' });
      } else {
        const updatedCard = updateCard(cardData);
        setCards(prevCards => prevCards.map(card => 
          card.id === updatedCard.id ? updatedCard : card
        ));
        setNotification({ open: true, message: 'Card updated successfully', severity: 'success' });
      }
      setPopupOpen(false);
      setSelectedCard(null);
    } catch (error) {
      setNotification({ open: true, message: 'Failed to save card', severity: 'error' });
    }
  };

  const handleDeleteCard = (card) => {
    try {
      deleteCard(card.id);
      setCards(prevCards => prevCards.filter(c => c.id !== card.id));
      setPopupOpen(false);
      setSelectedCard(null);
      setNotification({ open: true, message: 'Card deleted successfully', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Failed to delete card', severity: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box width="100%">
      <Typography variant="h4" fontWeight="bold" mb={4} color="#166534">
        Payment and Billing Address
      </Typography>

      {/* Payment Methods */}
      <Typography variant="h6" mb={2}>
        Saved Payment Methods
      </Typography>

      {cards.map((card) => {
        const logo = getBrandLogo(card.cardType);
        return (
          <Paper
            key={card.id}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(0,128,128,0.3)",
              p: 2,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              '&:hover': {
                backgroundColor: 'rgba(22, 101, 52, 0.04)',
              },
            }}
            onClick={() => handleCardClick(card)}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              {logo ? (
                <Avatar 
                  src={logo} 
                  alt="Card Brand" 
                  sx={{ 
                    width: 48, 
                    height: 48,
                    backgroundColor: 'transparent',
                    '& img': {
                      objectFit: 'contain'
                    }
                  }} 
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48,
                    backgroundColor: '#e0e0e0'
                  }}
                >
                  💳
                </Avatar>
              )}
              <Box>
                <Typography fontWeight={600}>
                  {maskCardNumber(card.cardNumber)}
                </Typography> <br/>
                <Typography variant="body2" color="text.secondary">
                  {card.cardHolder}
                </Typography>
              </Box>
            </Stack>
            <Tooltip title="Options">
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(card);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        );
      })}

      <Button
        variant="contained"
        sx={{ backgroundColor: "#166534", mb: 4 }}
        onClick={handleAddCard}
      >
        Add Your Card
      </Button>

      <PaymentMethodPopup
        open={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          setSelectedCard(null);
        }}
        card={selectedCard}
        onUpdate={handleUpdateCard}
        onDelete={handleDeleteCard}
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
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#166534' },
              '&.Mui-focused fieldset': { borderColor: '#166534' },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#166534',
            },
          }}
        />
        <TextField
          label="Address Line 2 (optional)"
          fullWidth
          name="address2"
          value={address.address2}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#166534' },
              '&.Mui-focused fieldset': { borderColor: '#166534' },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#166534',
            },
          }}
        />
        <Box display="flex" gap={2}>
          <TextField
            label="Suburb / City"
            fullWidth
            name="city"
            value={address.city}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#166534' },
                '&.Mui-focused fieldset': { borderColor: '#166534' },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#166534',
              },
            }}
          />
          <TextField
            label="Postcode"
            fullWidth
            name="postcode"
            value={address.postcode}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#166534' },
                '&.Mui-focused fieldset': { borderColor: '#166534' },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#166534',
              },
            }}
          />
        </Box>
        <Box display="flex" gap={2}>
          <TextField
            label="State"
            fullWidth
            name="state"
            value={address.state}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#166534' },
                '&.Mui-focused fieldset': { borderColor: '#166534' },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#166534',
              },
            }}
          />
          <TextField
            label="Country"
            fullWidth
            name="country"
            value={address.country}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#166534' },
                '&.Mui-focused fieldset': { borderColor: '#166534' },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#166534',
              },
            }}
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
