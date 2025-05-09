import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Divider, Stack, IconButton, Card, CardContent, Container, Paper } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ShareIcon from '@mui/icons-material/Share';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

const shareIcons = {
  instagram: <InstagramIcon sx={{ color: '#e1306c' }} />,
  whatsapp: <WhatsAppIcon sx={{ color: '#25d366' }} />,
  facebook: <FacebookIcon sx={{ color: '#0084ff' }} />,
};

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

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`https://api.ticketexpert.me/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Loading event details...</Typography>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Event Not Found</Typography>
        <Typography variant="body1" color="text.secondary">The event you are looking for does not exist.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link underline="hover" color={colorScheme.blue.primary} href="/events" sx={{ fontWeight: 600 }}>
            Events
          </Link>
          <Typography color={colorScheme.blue.primary} fontWeight={600}>
            {event.category}
          </Typography>
        </Breadcrumbs>

        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
          <Box
            component="img"
            src={event.image}
            alt={event.title}
            sx={{
              width: '100%',
              height: { xs: 240, md: 400 },
              objectFit: 'cover',
            }}
          />

          <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: '#e6f0ff' }}>
            <Stack spacing={3}>
              <Box>
                <Chip 
                  label={event.category} 
                  sx={{ 
                    bgcolor: colorScheme.blue.light,
                    color: colorScheme.blue.primary,
                    fontWeight: 600, 
                    mb: 2 
                  }} 
                />
                <Typography variant="h3" fontWeight="bold" color={colorScheme.blue.primary} sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  {event.title}
                </Typography>
              </Box>

              {/* Quick Info */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarTodayIcon sx={{ color: colorScheme.blue.primary }} />
                  <Typography variant="body1" color="text.secondary">
                    {formatDate(event.fromDateTime)}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOnIcon sx={{ color: colorScheme.blue.primary }} />
                  <Typography variant="body1" color="text.secondary">
                    {event.venue}, {event.region}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
                <Button 
                  variant="contained" 
                  size="large"
                  component={RouterLink}
                  to={`/event/${event.eventId}/tickets`}
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
                  Get Tickets
                </Button>
                <Stack direction="row" spacing={1}>
                  <IconButton sx={{ color: colorScheme.blue.primary }}>
                    <ShareIcon />
                  </IconButton>
                  <IconButton sx={{ color: colorScheme.blue.primary }}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton sx={{ color: colorScheme.blue.primary }}>
                    <WhatsAppIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Paper>

        {/* Main Content */}
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
          {/* Left Column - Yellow Theme */}
          <Box flex={2}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 4, bgcolor: colorScheme.yellow.light }}>
              <Typography variant="h5" fontWeight="bold" color={colorScheme.yellow.primary} mb={3}>
                About This Event
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {event.description}
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: colorScheme.yellow.light }}>
              <Typography variant="h5" fontWeight="bold" color={colorScheme.yellow.primary} mb={3}>
                Event Details
              </Typography>
              <Stack spacing={3}>
                {/* Date and Time */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <AccessTimeIcon sx={{ color: colorScheme.yellow.primary }} />
                    <Typography variant="subtitle1" fontWeight={600}>Date & Time</Typography>
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    {formatDate(event.fromDateTime)} - {formatDate(event.toDateTime)}
                  </Typography>
                </Box>

                {/* Location */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <LocationOnIcon sx={{ color: colorScheme.yellow.primary }} />
                    <Typography variant="subtitle1" fontWeight={600}>Location</Typography>
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    {event.venue}, {event.region}
                  </Typography>
                </Box>

                {/* Pricing */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <AttachMoneyIcon sx={{ color: colorScheme.yellow.primary }} />
                    <Typography variant="subtitle1" fontWeight={600}>Pricing</Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {event.pricing.map((price, index) => (
                      <Box key={index} sx={{ 
                        p: 2, 
                        bgcolor: 'white', 
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body1" fontWeight={500}>
                          {price.type}
                        </Typography>
                        <Typography variant="h6" color={colorScheme.yellow.primary} fontWeight={600}>
                          ${price.price.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    <b>Refund Policy:</b> {event.refundPolicy}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Right Column - Green Theme */}
          <Box flex={1}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: colorScheme.green.light }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <GroupWorkIcon sx={{ color: colorScheme.green.primary }} />
                <Typography variant="h6" fontWeight="bold" color={colorScheme.green.primary}>Organizer</Typography>
              </Stack>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                {event.organiser}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {event.orgDescription}
              </Typography> <br/><br/>
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    bgcolor: colorScheme.green.primary,
                    borderRadius: 99,
                    fontWeight: 600,
                    py: 0.75,
                    px: 2,
                    fontSize: '0.875rem',
                    '&:hover': { bgcolor: colorScheme.green.hover }
                  }}
                >
                  Contact Organizer
                </Button>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    borderColor: colorScheme.green.primary,
                    color: colorScheme.green.primary,
                    borderRadius: 99,
                    fontWeight: 600,
                    py: 0.75,
                    px: 2,
                    fontSize: '0.875rem',
                    '&:hover': { 
                      borderColor: colorScheme.green.hover,
                      bgcolor: 'rgba(22,101,52,0.04)'
                    }
                  }}
                >
                  Follow Organizer
                </Button>
              </Stack>
            </Paper>

            {/* Tags - Red Theme */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mt: 4, bgcolor: colorScheme.red.light }}>
              <Typography variant="h6" fontWeight="bold" color={colorScheme.red.primary} mb={2}>Tags</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {event.tags.map((tag, idx) => (
                  <Chip 
                    key={idx} 
                    label={tag} 
                    sx={{ 
                      bgcolor: 'white',
                      color: colorScheme.red.primary,
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: colorScheme.red.light
                      }
                    }} 
                  />
                ))}
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
} 