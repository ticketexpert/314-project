import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Stack, Container, Paper, Grid } from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupWorkIcon from '@mui/icons-material/GroupWork';

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

export default function OrganisationEvents() {
  const { id } = useParams();
  const [organisation, setOrganisation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganisationAndEvents = async () => {
      try {
        // Fetch organisation details
        const orgResponse = await fetch(`https://api.ticketexpert.me/api/organisations/${id}`);
        if (!orgResponse.ok) {
          throw new Error('Failed to fetch organisation');
        }
        const orgData = await orgResponse.json();
        setOrganisation(orgData);

        // Fetch all events
        const eventsResponse = await fetch('https://api.ticketexpert.me/api/events');
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events');
        }
        const eventsData = await eventsResponse.json();
        
        // Filter events for this organisation
        const orgEvents = eventsData.filter(event => event.eventOrgId === parseInt(id));
        setEvents(orgEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisationAndEvents();
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
        <Typography variant="h6">Loading events...</Typography>
      </Container>
    );
  }

  if (error || !organisation) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Organisation Not Found</Typography>
        <Typography variant="body1" color="text.secondary">The organisation you are looking for does not exist.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link underline="hover" color={colorScheme.blue.primary} href="/organisations" sx={{ fontWeight: 600 }}>
            Organisations
          </Link>
          <Link 
            underline="hover" 
            color={colorScheme.blue.primary} 
            href={`/organisation/${organisation.eventOrgId}`} 
            sx={{ fontWeight: 600 }}
          >
            {organisation.name}
          </Link>
          <Typography color={colorScheme.blue.primary} fontWeight={600}>
            Events
          </Typography>
        </Breadcrumbs>

        {/* Organisation Header */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 4, bgcolor: colorScheme.blue.light }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <GroupWorkIcon sx={{ color: colorScheme.blue.primary, fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold" color={colorScheme.blue.primary}>
                {organisation.name}
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              {organisation.description}
            </Typography>
          </Stack>
        </Paper>

        {/* Events Grid */}
        <Typography variant="h5" fontWeight="bold" color={colorScheme.blue.primary} mb={3}>
          Upcoming Events
        </Typography>

        {events.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: colorScheme.yellow.light }}>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No upcoming events found for this organisation.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} md={6} lg={4} key={event.eventId}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 4, 
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={event.image || 'https://via.placeholder.com/400x200'}
                    alt={event.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                    }}
                  />
                  <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Chip 
                      label={event.category} 
                      size="small"
                      sx={{ 
                        bgcolor: colorScheme.blue.light,
                        color: colorScheme.blue.primary,
                        fontWeight: 600,
                        mb: 2,
                        alignSelf: 'flex-start'
                      }} 
                    />
                    <Typography variant="h6" fontWeight="bold" mb={1} sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {event.title}
                    </Typography>
                    <Stack spacing={1} mb={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarTodayIcon sx={{ color: colorScheme.blue.primary, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(event.fromDateTime)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOnIcon sx={{ color: colorScheme.blue.primary, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.venue}, {event.region}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Box sx={{ mt: 'auto' }}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        component={RouterLink}
                        to={`/event/${event.eventId}`}
                        sx={{ 
                          bgcolor: colorScheme.blue.primary,
                          borderRadius: 99,
                          fontWeight: 600,
                          py: 1,
                          '&:hover': { 
                            bgcolor: colorScheme.blue.hover,
                          }
                        }}
                      >
                        View Event
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
} 