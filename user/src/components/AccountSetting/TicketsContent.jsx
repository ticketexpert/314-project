import React, { useEffect, useState, useRef } from "react";
import { 
  Box, Button, Typography, Paper, Chip, Stack, Tooltip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
  Alert, Snackbar, Grid, Fade, Zoom, IconButton
} from "@mui/material";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { QRCodeSVG } from 'qrcode.react';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import TickLogo from '../../assets/Tick.svg';
import Asset2Logo from '../../assets/Asset 2.svg';

export default function TicketsContent() {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [ticketToReturn, setTicketToReturn] = useState(null);
  const ticketRef = useRef(null);
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setTickets([]);
      setLoading(false);
      return;
    }

    // Fetch tickets and events in parallel
    Promise.all([
      fetch(`https://api.ticketexpert.me/api/tickets/user/${userId}`).then(res => res.json()),
      fetch('https://api.ticketexpert.me/api/events/').then(res => res.json())
    ])
      .then(([ticketsData, eventsData]) => {
        setTickets(ticketsData);
        // Map events by eventId for quick lookup
        const eventMap = {};
        eventsData.forEach(event => {
          eventMap[event.eventId] = event;
        });
        setEvents(eventMap);
        setLoading(false);
      })
      .catch(() => {
        setTickets([]);
        setEvents({});
        setLoading(false);
      });
  }, []);

  const handleReturnTicket = async (ticketId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setSnackbar({
        open: true,
        message: 'Please log in to return tickets',
        severity: 'error'
      });
      return;
    }

    setReturnLoading(true);
    try {
      const response = await fetch(`https://api.ticketexpert.me/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          status: 'refund_request'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to return ticket');
      }

      // Update local state
      setTickets(tickets.map(ticket => 
        ticket.ticketId === ticketId 
          ? { ...ticket, ticketStatus: 'refund_request' }
          : ticket
      ));

      setSnackbar({
        open: true,
        message: 'Return request submitted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to return ticket',
        severity: 'error'
      });
    } finally {
      setReturnLoading(false);
    }
  };

  const handleLearnMore = (ticket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTicket(null);
  };

  const handleReturnClick = (ticket) => {
    setTicketToReturn(ticket);
    setConfirmDialogOpen(true);
  };

  const handleConfirmReturn = async () => {
    if (!ticketToReturn) return;
    await handleReturnTicket(ticketToReturn.ticketId);
    setConfirmDialogOpen(false);
    setTicketToReturn(null);
  };

  const handleCancelReturn = () => {
    setConfirmDialogOpen(false);
    setTicketToReturn(null);
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'scanned':
        return 'Ticket Scanned';
      case 'refund_request':
        return 'Refund Requested';
      case 'refunded':
        return 'Refunded';
      case 'cancelled':
        return 'Cancelled';
      case 'active':
        return 'Active';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'refund_request':
        return 'warning';
      case 'refunded':
        return 'info';
      case 'cancelled':
        return 'error';
      case 'scanned':
        return 'default';
      default:
        return 'default';
    }
  };

  const handlePrintTicket = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setSnackbar({
        open: true,
        message: 'Please allow popups to print tickets',
        severity: 'warning'
      });
      return;
    }

    const ticket = selectedTicket;
    const event = events[ticket?.eventId];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket - ${event?.title || 'Event Ticket'}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Rethink Sans', sans-serif;
              margin: 20px;
              padding: 0;
              background: #f8fafc;
            }
            .ticket {
              border: 2px solid #D12026;
              padding: 30px;
              max-width: 800px;
              margin: 0 auto;
              background: #ecfdf5;
              border-radius: 16px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(97deg, #F99B1C -1.26%, #D12026 68.5%);
              color: white;
              padding: 30px;
              text-align: center;
              margin: -30px -30px 30px -30px;
              border-radius: 14px 14px 0 0;
            }
            .logo-container {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 20px;
              margin-bottom: 20px;
            }
            .logo {
              height: 40px;
              width: auto;
              filter: brightness(0) invert(1);
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0;
              font-size: 18px;
              opacity: 0.9;
            }
            .ticket-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            .info-section {
              background: rgba(22,101,52,0.05);
              padding: 20px;
              border-radius: 12px;
            }
            .info-section h3 {
              margin: 0 0 15px;
              color: #166534;
              font-size: 18px;
              font-weight: 600;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              font-size: 15px;
            }
            .info-label {
              color: #4b5563;
            }
            .info-value {
              font-weight: 500;
              color: #166534;
            }
            .qr-code {
              text-align: center;
              margin: 30px 0;
            }
            .qr-code img {
              max-width: 200px;
              padding: 15px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .qr-code p {
              margin-top: 10px;
              color: #4b5563;
              font-size: 14px;
            }
            .purchase-date {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #6b7280;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                background: white;
              }
              .ticket {
                box-shadow: none;
                border: 2px solid #D12026;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div class="logo-container">
                <img src="${TickLogo}" alt="Tick Logo" class="logo" />
                <img src="${Asset2Logo}" alt="Asset 2 Logo" class="logo" />
              </div>
              <h1>${event?.title || 'Event Ticket'}</h1>
              <p>${event?.venue || 'Venue'}</p>
            </div>
            <div class="ticket-info">
              <div class="info-section">
                <h3>Ticket Information</h3>
                <div class="info-row">
                  <span class="info-label">Ticket ID</span>
                  <span class="info-value">${ticket?.ticketId}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Order Number</span>
                  <span class="info-value">${ticket?.orderNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Ticket Type</span>
                  <span class="info-value">${ticket?.ticketType}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status</span>
                  <span class="info-value">${getStatusDisplay(ticket?.ticketStatus)}</span>
                </div>
              </div>
              <div class="info-section">
                <h3>Location Details</h3>
                <div class="info-row">
                  <span class="info-label">Section</span>
                  <span class="info-value">${ticket?.locationDetails?.section}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Row</span>
                  <span class="info-value">${ticket?.locationDetails?.row}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Seat</span>
                  <span class="info-value">${ticket?.locationDetails?.seat}</span>
                </div>
              </div>
            </div>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket?.ticketId}" alt="QR Code" />
              <p>Scan at entry</p>
            </div>
            <div class="purchase-date">
              Purchase Date: ${new Date(ticket?.createdAt).toLocaleString()}
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setSnackbar({
        open: true,
        message: 'Please allow popups to print tickets',
        severity: 'warning'
      });
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>All Tickets</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Rethink Sans', sans-serif;
              margin: 20px;
              padding: 0;
              background: #f8fafc;
            }
            .ticket {
              border: 2px solid #D12026;
              padding: 30px;
              max-width: 800px;
              margin: 0 auto 40px;
              background: #ecfdf5;
              border-radius: 16px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              page-break-after: always;
            }
            .header {
              background: linear-gradient(97deg, #F99B1C -1.26%, #D12026 68.5%);
              color: white;
              padding: 30px;
              text-align: center;
              margin: -30px -30px 30px -30px;
              border-radius: 14px 14px 0 0;
            }
            .logo-container {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 20px;
              margin-bottom: 20px;
            }
            .logo {
              height: 40px;
              width: auto;
              filter: brightness(0) invert(1);
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0;
              font-size: 18px;
              opacity: 0.9;
            }
            .ticket-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            .info-section {
              background: rgba(22,101,52,0.05);
              padding: 20px;
              border-radius: 12px;
            }
            .info-section h3 {
              margin: 0 0 15px;
              color: #166534;
              font-size: 18px;
              font-weight: 600;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              font-size: 15px;
            }
            .info-label {
              color: #4b5563;
            }
            .info-value {
              font-weight: 500;
              color: #166534;
            }
            .qr-code {
              text-align: center;
              margin: 30px 0;
            }
            .qr-code img {
              max-width: 200px;
              padding: 15px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .qr-code p {
              margin-top: 10px;
              color: #4b5563;
              font-size: 14px;
            }
            .purchase-date {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #6b7280;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                background: white;
              }
              .ticket {
                box-shadow: none;
                border: 2px solid #D12026;
              }
            }
          </style>
        </head>
        <body>
          ${tickets.map((ticket) => {
            const event = events[ticket.eventId];
            return `
              <div class="ticket">
                <div class="header">
                  <div class="logo-container">
                    <img src="${TickLogo}" alt="Tick Logo" class="logo" />
                    <img src="${Asset2Logo}" alt="Asset 2 Logo" class="logo" />
                  </div>
                  <h1>${event?.title || 'Event Ticket'}</h1>
                  <p>${event?.venue || 'Venue'}</p>
                </div>
                <div class="ticket-info">
                  <div class="info-section">
                    <h3>Ticket Information</h3>
                    <div class="info-row">
                      <span class="info-label">Ticket ID</span>
                      <span class="info-value">${ticket.ticketId}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Order Number</span>
                      <span class="info-value">${ticket.orderNumber}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Ticket Type</span>
                      <span class="info-value">${ticket.ticketType}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Status</span>
                      <span class="info-value">${getStatusDisplay(ticket.ticketStatus)}</span>
                    </div>
                  </div>
                  <div class="info-section">
                    <h3>Location Details</h3>
                    <div class="info-row">
                      <span class="info-label">Section</span>
                      <span class="info-value">${ticket.locationDetails?.section}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Row</span>
                      <span class="info-value">${ticket.locationDetails?.row}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Seat</span>
                      <span class="info-value">${ticket.locationDetails?.seat}</span>
                    </div>
                  </div>
                </div>
                <div class="qr-code">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.ticketId}" alt="QR Code" />
                  <p>Scan at entry</p>
                </div>
                <div class="purchase-date">
                  Purchase Date: ${new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
            `;
          }).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const handleShareTicket = async () => {
    try {
      await navigator.share({
        title: 'My Event Ticket',
        text: `Check out my ticket for ${events[selectedTicket?.eventId]?.title || 'the event'}!`,
        url: window.location.href
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <Box width="100%">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography variant="h4" fontWeight="bold" color="#166534">
          My Tickets
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrintAll}
            disabled={loading || tickets.length === 0}
            sx={{ 
              borderRadius: 2,
              borderColor: '#166534',
              color: '#166534',
              '&:hover': {
                borderColor: '#14532d',
                bgcolor: '#ecfdf5'
              }
            }}
          >
            {loading ? 'Generating PDF...' : 'Print All'}
          </Button>
        </Stack>
      </Box>

      {loading && (
        <Fade in={loading}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 4, 
            textAlign: 'center', 
            background: '#f8fafc', 
            color: '#888',
            animation: 'pulse 1.5s infinite'
          }}>
            <CircularProgress size={40} sx={{ color: '#166534', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold">Loading your tickets...</Typography>
          </Paper>
        </Fade>
      )}

      {!loading && tickets.length === 0 && (
        <Zoom in={!loading}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 4, 
            textAlign: 'center', 
            background: '#f8fafc', 
            color: '#888',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>No Tickets Found</Typography>
            <Typography fontSize="15px" mb={3}>You haven't purchased any tickets yet.</Typography>
            <br/>
            <Button
              variant="contained"
              href="/events"
              sx={{
                bgcolor: '#166534',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  bgcolor: '#14532d'
                }
              }}
            >
              Browse Events
            </Button>
          </Paper>
        </Zoom>
      )}

      <Stack spacing={3}>
        {tickets.map((ticket) => {
          const event = events[ticket.eventId];
          return (
            <Zoom in={!loading} key={ticket.ticketId}>
              <Paper
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: "24px",
                  backgroundColor: "#ecfdf5",
                  boxShadow: '0 4px 12px rgba(22,101,52,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(22,101,52,0.12)'
                  }
                }}
              >
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'start', md: 'center' }}>
                  <Box flex={1} minWidth={0}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#02735E' }}>
                      {event ? event.title : `Event #${ticket.eventId}`}
                    </Typography>
                    <Typography fontSize="15px" color="gray" mt={0.5}>
                      {event ? (
                        <>
                          {new Date(event.fromDateTime).toLocaleDateString()} • {event.venue}
                        </>
                      ) : (
                        <>Section: {ticket.locationDetails?.section} • Row: {ticket.locationDetails?.row} • Seat: {ticket.locationDetails?.seat}</>
                      )}
                    </Typography>

                    <Stack direction="row" spacing={1} mt={2} mb={1} flexWrap="wrap">
                      <Chip 
                        icon={<ConfirmationNumberIcon />} 
                        label={`Ticket ID: ${ticket.ticketId}`} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#02735E', 
                          color: '#ffffff',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }} 
                      />
                      <Chip 
                        icon={<EventSeatIcon />} 
                        label={ticket.ticketType} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#02735E', 
                          color: '#ffffff',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }} 
                      />
                      <Chip 
                        icon={<ReceiptIcon />}
                        label={`Order #${ticket.orderNumber}`}
                        size="small"
                        sx={{ 
                          bgcolor: '#02735E', 
                          color: '#ffffff',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                      <Chip 
                        label={getStatusDisplay(ticket.ticketStatus)} 
                        size="small" 
                        color={getStatusColor(ticket.ticketStatus)}
                      />
                    </Stack>

                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography fontSize="14px" color="text.secondary">
                        <strong>Location Details:</strong>
                      </Typography>
                      <br/>
                      <Typography fontSize="14px" color="text.secondary">
                        Section: {ticket.locationDetails?.section} <br/> Seat: {ticket.locationDetails?.row} | {ticket.locationDetails?.seat}
                      </Typography>
                    </Box>

                    <Typography fontSize="14px" color="text.secondary" mb={1}>
                      <strong>Purchase Date:</strong> {new Date(ticket.createdAt).toLocaleString()}
                    </Typography>

                    <Box display="flex" gap={2} mt={2}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#166534",
                          borderRadius: "9999px",
                          fontWeight: 'bold',
                        }}
                        onClick={() => handleReturnClick(ticket)}
                        disabled={returnLoading || ticket.ticketStatus !== 'active'}
                      >
                        {returnLoading ? <CircularProgress size={24} color="inherit" /> : 'Return'}
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#166534",
                          color: "#166534",
                          borderRadius: "9999px",
                          fontWeight: 'bold',
                        }}
                        onClick={() => handleLearnMore(ticket)}
                      >
                        Learn More
                      </Button>
                    </Box>
                  </Box>
                  {ticket.ticketStatus === 'active' && (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={{ xs: 3, md: 0 }} ml={{ md: 4 }}>
                      <Tooltip title="Show QR Code">
                        <Box sx={{ 
                          width: 90, 
                          height: 90, 
                          bgcolor: '#fff', 
                          border: '1px solid #e0e0e0', 
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1
                        }}>
                          <QRCodeSVG value={ticket.ticketId} size={80} />
                        </Box>
                      </Tooltip>
                      <Typography fontSize="12px" color="gray">Scan at entry</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Zoom>
          );
        })}
      </Stack>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        {selectedTicket && (
          <>
            <DialogTitle sx={{ 
              bgcolor: '#166534', 
              color: 'white',
              p: 3,
              position: 'relative'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Typography variant="h5" fontWeight="bold">
                  {events[selectedTicket.eventId]?.title || `Event #${selectedTicket.eventId}`}
                </Typography>
                <IconButton 
                  onClick={handleCloseDialog}
                  sx={{ 
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
                {events[selectedTicket.eventId]?.venue || 'Venue'}
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ p: 3 }} ref={ticketRef}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={selectedTicket.ticketStatus === 'active' ? 6 : 12}>
                    <Box sx={{ 
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(22,101,52,0.05)'
                    }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Ticket Information
                      </Typography>
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Ticket ID</Typography>
                          <Typography variant="body2" fontWeight="bold">{selectedTicket.ticketId}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Order Number</Typography>
                          <Typography variant="body2" fontWeight="bold">{selectedTicket.orderNumber}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Ticket Type</Typography>
                          <Typography variant="body2" fontWeight="bold">{selectedTicket.ticketType}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Status</Typography>
                          <Chip 
                            label={getStatusDisplay(selectedTicket.ticketStatus)} 
                            size="small" 
                            color={getStatusColor(selectedTicket.ticketStatus)}
                            sx={{ 
                              fontWeight: 'bold',
                              '& .MuiChip-label': { px: 1 }
                            }}
                          />
                        </Box>
                      </Stack>
                    </Box>

                    <Box sx={{ 
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(22,101,52,0.05)'
                    }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Location Details
                      </Typography>
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Section</Typography>
                          <Typography variant="body2" fontWeight="bold">{selectedTicket.locationDetails?.section}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Row</Typography>
                          <Typography variant="body2" fontWeight="bold">{selectedTicket.locationDetails?.row}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Seat</Typography>
                          <Typography variant="body2" fontWeight="bold">{selectedTicket.locationDetails?.seat}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                  {selectedTicket.ticketStatus === 'active' && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                      }}>
                        <Box sx={{ 
                          bgcolor: 'white',
                          p: 3,
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          mb: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                          }
                        }}>
                          <QRCodeSVG 
                            value={selectedTicket.ticketId} 
                            size={180} 
                            data-ticket-id={selectedTicket.ticketId}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                          Scan at entry
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                          <Button
                            startIcon={<PrintIcon />}
                            onClick={handlePrintTicket}
                            sx={{ 
                              color: '#166534',
                              '&:hover': { bgcolor: 'rgba(22,101,52,0.1)' }
                            }}
                          >
                            Print
                          </Button>
                          <Button
                            startIcon={<ShareIcon />}
                            onClick={handleShareTicket}
                            sx={{ 
                              color: '#166534',
                              '&:hover': { bgcolor: 'rgba(22,101,52,0.1)' }
                            }}
                          >
                            Share
                          </Button>
                        </Stack>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                <Box sx={{ 
                  mt: 3, 
                  pt: 2, 
                  borderTop: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Purchase Date: {new Date(selectedTicket.createdAt).toLocaleString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReturnClick(selectedTicket)}
                    disabled={selectedTicket.ticketStatus !== 'active'}
                    sx={{ 
                      borderRadius: 2,
                      px: 3,
                      '&:hover': {
                        bgcolor: '#d32f2f'
                      }
                    }}
                  >
                    Return Ticket
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelReturn}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#fff3e0', 
          color: '#e65100',
          p: 3
        }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">Confirm Return Request</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <Typography variant="body1" gutterBottom fontWeight="medium">
            Are you sure you want to return this ticket?
          </Typography>
          <br/>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action will submit a refund request for your ticket. The refund process may take 5-7 business days.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Button 
            onClick={handleCancelReturn} 
            sx={{ 
              color: '#666',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmReturn}
            variant="contained"
            color="error"
            disabled={returnLoading}
            sx={{ 
              borderRadius: 2,
              px: 3,
              '&:hover': {
                bgcolor: '#d32f2f'
              }
            }}
          >
            {returnLoading ? <CircularProgress size={24} /> : 'Confirm Return'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': {
              fontSize: 24
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
