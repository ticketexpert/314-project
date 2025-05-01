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

const events = [
  {
    id: 1,
    title: "Illawarra Hawks Celebrate with the City",
    location: "Crown Street Mall, Wollongong",
    date: "27 MAR",
    image: "https://content.api.news/v3/images/bin/646402e6eb12d917fbf41a42737b95d3"
  },
  {
    id: 2,
    title: "Wollongong Music Festival",
    location: "Wollongong Botanic Garden",
    date: "15 APR",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"
  },
  {
    id: 3,
    title: "Art in the Park",
    location: "Stuart Park, Wollongong",
    date: "22 APR",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
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
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'sans-serif',
      width: '100vw',
      padding: 4, 
      boxSizing: 'border-box', 
      justifyContent: 'center',
    }}>
      <Card
        sx={{
          width: '30vw',
          borderRadius: '50px',
          padding: 3,
          backgroundColor: '#0339A6',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: 350,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Search an event
        </Typography>
        
        <InputBase
          placeholder="Enter your place here"
          sx={{
            bgcolor: 'white',
            borderRadius: 5,
            px: 2,
            py: 1,
            color: '#0033a0',
          }}
        />

        <InputBase
          placeholder="Date"
          sx={{
            bgcolor: 'white',
            borderRadius: 5,
            px: 2,
            py: 1,
            color: '#0033a0',
          }}
        />

        <InputBase
          placeholder="Find an artist, event name or venue"
          sx={{
            bgcolor: 'white',
            borderRadius: 5,
            px: 2,
            py: 1,
            color: '#0033a0',
          }}
        />

        <Button
          variant="contained"
          sx={{
            alignSelf: 'flex-end',
            borderRadius: '33.5px',
            backgroundColor: '#034AA6',
            px: 4,
            '&:hover': {
              backgroundColor: '#033b88', // optional darker hover
            },
          }}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Card>

      {/* Event Carousel */}
      <Box sx={{ position: 'relative', width: '60vw', height: 350, borderRadius: '50px',}}>
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
                justifyContent: 'flex-start',
                color: 'white',
                p: 3,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
              }}
            >
              <Box sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                p: 2, 
                borderRadius: 2,
                mb: 2,
                width: 'fit-content',
              }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
                  {event.date}
                </Typography>
              </Box>
              <Box sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                p: 2, 
                borderRadius: 2,
                mb: 2,
                width: '100%',
              }}>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  sx={{ 
                    color: '#fff',
                    lineHeight: 1.2,
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  {event.title}
                </Typography>
              </Box>
              <Box sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                p: 2, 
                borderRadius: 2,
                width: 'fit-content',
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#fff',
                    fontWeight: 500
                  }}
                >
                  {event.location}
                </Typography>
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
    </Box>
  );
}
