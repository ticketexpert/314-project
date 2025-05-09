import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Stack, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

const getUniqueCategories = (events) => [
  'All',
  ...Array.from(new Set(events.map(e => e.category)))
];

const getUniqueLocations = (events) => [
  'All',
  ...Array.from(new Set(events.map(e => e.region)))
];

const sortOptions = [
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'date', label: 'Date' },
];

export default function EventsList() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [date, setDate] = useState(null);
  const [sort, setSort] = useState('title');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle URL parameters on component mount
  useEffect(() => {
    const locationParam = searchParams.get('location');
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
<<<<<<< Updated upstream
    const dateParam = searchParams.get('date');
=======
>>>>>>> Stashed changes

    if (locationParam) setLocation(locationParam);
    if (categoryParam) setCategory(categoryParam);
    if (searchParam) setSearch(searchParam);
<<<<<<< Updated upstream
    if (dateParam) {
      try {
        const parsedDate = new Date(dateParam);
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
=======
>>>>>>> Stashed changes
  }, [searchParams]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://api.ticketexpert.me/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = useMemo(() => getUniqueCategories(events), [events]);
  const locations = useMemo(() => getUniqueLocations(events), [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      // Category and location filtering
      const categoryMatch = category === 'All' || event.category === category;
      const locationMatch = location === 'All' || event.region === location;

<<<<<<< Updated upstream
      // Date filtering
      const dateMatch = !date || (() => {
        const eventDate = new Date(event.fromDateTime);
        const searchDate = new Date(date);
        return eventDate.toDateString() === searchDate.toDateString();
      })();

      // Improved search matching with prefix priority
      const searchTerms = search.toLowerCase().split(' ').filter(term => term.length > 0);
      const searchMatch = searchTerms.length === 0 || searchTerms.every(term => {
        // Check title
        const titleWords = event.title.toLowerCase().split(' ');
        const titleMatch = titleWords.some(word => word.startsWith(term) || term.startsWith(word));
        
        // Check description
        const descriptionWords = event.description.toLowerCase().split(' ');
        const descriptionMatch = descriptionWords.some(word => word.startsWith(term) || term.startsWith(word));
        
        // Check category
        const categoryMatch = event.category.toLowerCase().startsWith(term) || term.startsWith(event.category.toLowerCase());
        
        // Check tags
        const tagsMatch = event.tags?.some(tag => tag.toLowerCase().startsWith(term) || term.startsWith(tag.toLowerCase()));

        return titleMatch || descriptionMatch || categoryMatch || tagsMatch;
      });

      return categoryMatch && locationMatch && dateMatch && searchMatch;
=======
      const searchTerms = search.toLowerCase().split(' ').filter(term => term.length > 0);
      const searchMatch = searchTerms.length === 0 || searchTerms.every(term => {
        const titleWords = event.title.toLowerCase().split(' ');
        const descriptionWords = event.description.toLowerCase().split(' ');
        
        // Check for exact matches first
        const hasExactMatch = titleWords.some(word => word === term) || 
                            descriptionWords.some(word => word === term);
        
        if (hasExactMatch) return true;

        // If no exact match, check for prefix matches and similar words
        const hasPrefixOrSimilarMatch = titleWords.some(word => {
          // Check if word starts with the search term
          if (word.startsWith(term)) return true;
          // Check if search term starts with the word
          if (term.startsWith(word)) return true;
          // Check for similar words (allowing for 1 character difference)
          if (Math.abs(word.length - term.length) <= 1) {
            const differences = [...word].filter((char, i) => char !== term[i]).length;
            return differences <= 1;
          }
          return false;
        }) || descriptionWords.some(word => {
          if (word.startsWith(term)) return true;
          if (term.startsWith(word)) return true;
          if (Math.abs(word.length - term.length) <= 1) {
            const differences = [...word].filter((char, i) => char !== term[i]).length;
            return differences <= 1;
          }
          return false;
        });

        return hasPrefixOrSimilarMatch;
      });

      return categoryMatch && locationMatch && searchMatch;
>>>>>>> Stashed changes
    });

    if (sort === 'title') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'date') {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.fromDateTime);
        const dateB = new Date(b.fromDateTime);
        return dateA - dateB;
      });
    }
    return filtered;
  }, [search, category, location, date, sort, events]);

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

  const getLowestPrice = (pricing) => {
    if (!pricing || pricing.length === 0) return 'N/A';
    const prices = pricing.map(p => p.price).filter(price => price !== null && price !== undefined);
    return prices.length > 0 ? Math.min(...prices) : 'N/A';
  };

  // Update URL when filters change
  const updateURL = (newLocation, newCategory, newSearch, newDate) => {
    const params = new URLSearchParams();
    if (newLocation !== 'All') params.set('location', newLocation);
    if (newCategory !== 'All') params.set('category', newCategory);
    if (newSearch) params.set('search', newSearch);
    if (newDate) {
      // Format date as YYYY-MM-DD for cleaner URLs
      const formattedDate = newDate.toISOString().split('T')[0];
      params.set('date', formattedDate);
    }
    window.history.replaceState(null, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    updateURL(newLocation, category, search, date);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    updateURL(location, newCategory, search, date);
  };

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    updateURL(location, category, newSearch, date);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    updateURL(location, category, search, newDate);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getLowestPrice = (pricing) => {
    if (!pricing || pricing.length === 0) return 'N/A';
    return Math.min(...pricing.map(p => p.price));
  };

  // Update URL when filters change
  const updateURL = (newLocation, newCategory, newSearch) => {
    const params = new URLSearchParams();
    if (newLocation !== 'All') params.set('location', newLocation);
    if (newCategory !== 'All') params.set('category', newCategory);
    if (newSearch) params.set('search', newSearch);
    window.history.replaceState(null, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    updateURL(newLocation, category, search);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    updateURL(location, newCategory, search);
  };

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    updateURL(location, category, newSearch);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, pt: '100px', textAlign: 'center' }}>
        <Typography variant="h6">Loading events...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, pt: '100px' }}>
      <Typography variant="h4" fontWeight="bold" color="#9F1B32" mb={3}>
        {location !== 'All' ? `Events in ${location}` : 'All Events'}
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search events..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 220, flex: 2 }}
        />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={e => handleCategoryChange(e.target.value)}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={location}
            label="Location"
            onChange={e => handleLocationChange(e.target.value)}
          >
            {locations.map(loc => (
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sort}
            label="Sort By"
            onChange={e => setSort(e.target.value)}
          >
            {sortOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Grid container spacing={3}>
        {filteredEvents.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6">No events found.</Typography>
                {location !== 'All' && (
                  <Button
                    variant="outlined"
                    onClick={() => handleLocationChange('All')}
                    sx={{ mt: 2 }}
                  >
                    View All Events
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredEvents.map(event => (
            <Grid item xs={12} key={event.eventId}>
              <Card sx={{width: { xs: '100%', sm: '80vw' }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 4, boxShadow: '0 2px 8px rgba(22,101,52,0.08)', height: { sm: 180, xs: 'auto' } }}>
                <Box
                  component="img"
                  src={event.image}
                  alt={event.title}
                  sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 180, sm: '100%' }, objectFit: 'cover', borderTopLeftRadius: 4, borderBottomLeftRadius: { sm: 4, xs: 0 }, borderTopRightRadius: { xs: 4, sm: 0 } }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                    <Chip label={event.category.toUpperCase()} color="success" size="small" sx={{ bgcolor: '#e6f4ea', color: '#166534', fontWeight: 600, minWidth: 110, maxWidth: 140 }} />
                    <Chip label={formatDate(event.fromDateTime)} color="primary" size="small" sx={{ bgcolor: '#e0e7ff', color: '#034AA6', fontWeight: 600, minWidth: 110, maxWidth: 140 }} />
                    <Chip label={`Ticket from $${getLowestPrice(event.pricing)}`} size="small" sx={{ bgcolor: '#fbe9eb', color: '#9F1B32', fontWeight: 500, minWidth: 110, maxWidth: 140 }} />
                    <Chip label={event.region} size="small" sx={{ bgcolor: '#f3e8ff', color: '#6b21a8', fontWeight: 500, minWidth: 110, maxWidth: 140 }} />
                  </Stack>
                  <Typography variant="h6" fontWeight="bold" sx={{ whiteSpace: 'normal', wordBreak: 'break-word', mb: 1 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description.length > 90 ? event.description.slice(0, 90) + '...' : event.description}
                  </Typography>
                  <Box sx={{ mt: 'auto', textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      size="small"
                      component={RouterLink}
                      to={`/event/${event.eventId}`}
                      sx={{ borderRadius: 99, fontWeight: 600, background: '#034AA6', color: 'white', '&:hover': { background: '#033b88' } }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
} 