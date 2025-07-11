import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  InputBase,
  Typography,
  Stack,
  IconButton,
  Autocomplete,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function EventSearch() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    location: '',
    date: '',
    query: ''
  });
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://api.ticketexpert.me/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setEvents(data);
          
          const uniqueLocations = [...new Set(data.map(event => event.region).filter(Boolean))];
          
          setLocations(uniqueLocations);
        } else {
          console.error('Invalid data format received from API');
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handlePrev = () => {
    if (events.length > 0) {
      setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (events.length > 0) {
      setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.location) params.set('location', searchParams.location);
    if (searchParams.date) params.set('date', searchParams.date);
    if (searchParams.query) params.set('search', searchParams.query);
    
    navigate(`/events?${params.toString()}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100vw', minHeight: 780, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">Loading events...</Typography>
      </Box>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Box sx={{ width: '100vw', minHeight: 780, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">No events available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: 780,
        background: 'linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)',
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 8 },
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'left' }}>
          <Typography color="#034AA6" variant="h2" fontWeight="bold" mb={0.5}>Effortless Events, Expertly Managed</Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'left',  pb: 3}}>
      <Typography color="#166534" variant="h4" fontWeight="bold" mb={0.5}>only on TicketExpert</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          gap: 4,
          width: '100%',
          maxWidth: 1400,
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            width: { xs: '95vw', md: '32vw' },
            minWidth: 320,
            borderRadius: '40px',
            p: 2,
            background: 'linear-gradient(135deg, #034AA6 60%,rgb(6, 43, 92) 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(3,58,166,0.10)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            height: 370,
            justifyContent: 'center',
            mb: { xs: 3, md: 0 },
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={0.5}>
            Search for an Event
          </Typography>
          <Typography fontSize="15px" color="#e0e7ef" mb={1}>
            Enter your location, date, or event details to get started.
          </Typography>
          
          <Autocomplete
            freeSolo
            options={locations}
            value={searchParams.location}
            onChange={(_, newValue) => setSearchParams(prev => ({ ...prev, location: newValue }))}
            renderInput={(params) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'white',
                  borderRadius: 5,
                  px: 1.5,
                  py: 0.5,
                  mb: 1,
                  boxShadow: '0 2px 8px rgba(3,58,166,0.08)',
                  border: '2px solid transparent',
                  transition: 'border 0.2s',
                  '&:focus-within': {
                    border: '2px solid #034AA6',
                  },
                }}
              >
                <PlaceIcon sx={{ color: '#034AA6', mr: 1 }} />
                <TextField
                  {...params}
                  placeholder="Enter location"
                  variant="standard"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    style: {
                      color: '#0033a0',
                      fontWeight: 500,
                      fontSize: '1rem',
                    },
                  }}
                />
              </Box>
            )}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: 5,
              px: 1.5,
              py: 0.5,
              mb: 1,
              boxShadow: '0 2px 8px rgba(3,58,166,0.08)',
              border: '2px solid transparent',
              transition: 'border 0.2s',
              '&:focus-within': {
                border: '2px solid #034AA6',
              },
            }}
          >
            <CalendarTodayIcon sx={{ color: '#034AA6', mr: 1 }} />
            <InputBase
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
              sx={{
                flex: 1,
                color: '#0033a0',
                fontWeight: 500,
                fontSize: '1rem',
                '& input[type="date"]': {
                  color: '#0033a0',
                  fontWeight: 500,
                  fontSize: '1rem',
                  '&::-webkit-calendar-picker-indicator': {
                    filter: 'invert(0.4) sepia(1) saturate(20) hue-rotate(190deg)',
                    cursor: 'pointer',
                    color: '#034AA6'
                  },
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: 5,
              px: 1.5,
              py: 0.5,
              mb: 2,
              boxShadow: '0 2px 8px rgba(3,58,166,0.08)',
              border: '2px solid transparent',
              transition: 'border 0.2s',
              '&:focus-within': {
                border: '2px solid #034AA6',
              },
            }}
          >
            <PersonSearchIcon sx={{ color: '#034AA6', mr: 1 }} />
            <InputBase
              placeholder="Find an event or category"
              value={searchParams.query}
              onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
              sx={{
                flex: 1,
                color: '#0033a0',
                fontWeight: 500,
                fontSize: '1rem',
              }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              borderRadius: '33.5px',
              backgroundColor: '#034AA6',
              px: 3,
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(3,58,166,0.10)',
              width: { xs: '100%', md: 'auto' },
              alignSelf: { xs: 'stretch', md: 'flex-end' },
              '&:hover': {
                backgroundColor: '#033b88',
              },
            }}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Card>

        <Box sx={{ width: { xs: '95vw', md: '60vw' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 370,
              borderRadius: '40px',
              boxShadow: '0 8px 32px rgba(22,101,52,0.10)',
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            {events.map((event, index) => (
              <Card
                key={event.eventId}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: 6,
                  overflow: 'hidden',
                  opacity: index === activeIndex ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                  zIndex: index === activeIndex ? 1 : 0,
                  boxShadow: index === activeIndex ? '0 8px 32px rgba(22,101,52,0.18)' : 'none',
                }}
              >
                <Box
                  component="img"
                  src={event.image}
                  alt={event.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Card>
            ))}

            {events.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  <ArrowBackIosNewIcon sx={{ color: 'white' }} />
                </IconButton>

                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  <ArrowForwardIosIcon sx={{ color: 'white' }} />
                </IconButton>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1,
                    zIndex: 2,
                  }}
                >
                  {events.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: index === activeIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>

          {events.length > 0 && (
            <Box
              sx={{
                width: '100%',
                mt: 3,
                p: { xs: 2, md: 3 },
                background: '#fff',
                borderRadius: 4,
                boxShadow: '0 2px 12px rgba(22,101,52,0.08)',
                textAlign: 'left',
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="#0339A6" mb={1}>
                {events[activeIndex]?.title}
              </Typography>
              <Typography variant="subtitle1" color="#166534" mb={1}>
                {events[activeIndex]?.venue}, {events[activeIndex]?.region} &nbsp;|&nbsp; {formatDate(events[activeIndex]?.fromDateTime)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {events[activeIndex]?.description}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
