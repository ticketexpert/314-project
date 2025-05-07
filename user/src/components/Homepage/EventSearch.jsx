import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  InputBase,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const events = [
  {
    id: 1,
    title: "Illawarra Hawks Celebrate with the City",
    location: "Crown Street Mall, Wollongong",
    date: "27 MAR",
    image: "pics/Hawks.png",
    description: "Join the Illawarra Hawks for a day of celebration, live music, and family fun in the heart of Wollongong!"
  },
  {
    id: 2,
    title: "Wollongong Music Festival",
    location: "Wollongong Botanic Garden",
    date: "15 APR",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    description: "Experience a weekend of incredible music, food stalls, and community at the beautiful Botanic Garden."
  },
  {
    id: 3,
    title: "Art in the Park",
    location: "Stuart Park, Wollongong",
    date: "22 APR",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
    description: "Discover local artists, workshops, and interactive installations at Stuart Park."
  }
];

export default function EventSearch() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

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
      {/* Hero Headline */}
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          color: "#0339A6",
          mb: 1,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        Effortless Events, Expertly Managed
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: "#166534",
          mb: 4,
          textAlign: "center",
          fontWeight: 400,
        }}
      >
        Find concerts, festivals, and experiences you'll love. Search, explore, and book your next adventure!
      </Typography>

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
        {/* Left: Search Card */}
        <Card
          sx={{
            width: { xs: '95vw', md: '32vw' },
            minWidth: 320,
            borderRadius: '40px',
            p: 2,
            background: 'linear-gradient(135deg, #034AA6 60%, #166534 100%)',
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
            Enter your location, date, or artist to get started.
          </Typography>
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
                border: '2px solid #166534',
              },
            }}
          >
            <PlaceIcon sx={{ color: '#166534', mr: 1 }} />
            <InputBase
              placeholder="Enter your place here"
              sx={{
                flex: 1,
                color: '#0033a0',
                fontWeight: 500,
                fontSize: '1rem',
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
              mb: 1,
              boxShadow: '0 2px 8px rgba(3,58,166,0.08)',
              border: '2px solid transparent',
              transition: 'border 0.2s',
              '&:focus-within': {
                border: '2px solid #166534',
              },
            }}
          >
            <CalendarTodayIcon sx={{ color: '#166534', mr: 1 }} />
            <InputBase
              placeholder="Date"
              sx={{
                flex: 1,
                color: '#0033a0',
                fontWeight: 500,
                fontSize: '1rem',
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
                border: '2px solid #166534',
              },
            }}
          >
            <PersonSearchIcon sx={{ color: '#166534', mr: 1 }} />
            <InputBase
              placeholder="Find an artist, event name or venue"
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

        {/* Right: Carousel + Event Details */}
        <Box sx={{ width: { xs: '95vw', md: '60vw' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Event Carousel */}
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
                key={event.id}
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
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    color: 'white',
                    p: { xs: 2, md: 4 },
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.1) 100%)',
                  }}
                >
                  {/* Event Status Chip */}
                  <Box sx={{ position: 'absolute', top: 24, left: 24 }}>
                    <Box
                      sx={{
                        bgcolor: '#166534',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 99,
                        fontWeight: 600,
                        fontSize: 14,
                        letterSpacing: 1,
                        boxShadow: '0 2px 8px rgba(22,101,52,0.10)',
                        display: 'inline-block',
                      }}
                    >
                      Trending
                    </Box>
                  </Box>
                  {/* Date Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 24,
                      right: 24,
                      bgcolor: '#fff',
                      color: '#034AA6',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 18,
                      boxShadow: '0 2px 8px rgba(3,58,166,0.10)',
                      textAlign: 'center',
                      minWidth: 70,
                    }}
                  >
                    {event.date}
                  </Box>
                  {/* Event Info */}
                  <Box
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.55)',
                      borderRadius: 4,
                      p: { xs: 2, md: 3 },
                      mb: 2,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        color: '#fff',
                        lineHeight: 1.2,
                        fontSize: { xs: '1.3rem', md: '2rem' },
                        mb: 1,
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#e0e7ef',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        mb: 1,
                      }}
                    >
                      {event.location}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#b5e0c7',
                        mb: 2,
                        fontSize: { xs: '0.95rem', md: '1rem' },
                      }}
                    >
                      {event.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(90deg, #166534 60%, #034AA6 100%)',
                        color: 'white',
                        borderRadius: 99,
                        fontWeight: 700,
                        px: 4,
                        py: 1,
                        fontSize: '1rem',
                        boxShadow: '0 2px 8px rgba(22,101,52,0.10)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #034AA6 60%, #166534 100%)',
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 16px rgba(22,101,52,0.18)',
                        },
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}

            {/* Navigation Buttons */}
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

            {/* Dots Indicator */}
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
          </Box>
          {/* Event Details Below Carousel */}
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
              {events[activeIndex].title}
            </Typography>
            <Typography variant="subtitle1" color="#166534" mb={1}>
              {events[activeIndex].location} &nbsp;|&nbsp; {events[activeIndex].date}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {events[activeIndex].description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
