import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Stack, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
<<<<<<< Updated upstream
import { Link as RouterLink } from 'react-router-dom';

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'count', label: 'Number of Events' },
=======
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import { Link as RouterLink } from 'react-router-dom';

const getUniqueStates = (locations) => [
  'All',
  ...Array.from(new Set(locations.map(loc => loc.state)))
];

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'events', label: 'Number of Events' },
>>>>>>> Stashed changes
];

export default function LocationsList() {
  const [search, setSearch] = useState('');
<<<<<<< Updated upstream
  const [sort, setSort] = useState('name');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
=======
  const [state, setState] = useState('All');
  const [sort, setSort] = useState('name');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
>>>>>>> Stashed changes
      try {
        const response = await fetch('https://api.ticketexpert.me/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
<<<<<<< Updated upstream
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
=======
        const events = await response.json();
        
        // Process events to get location data
        const locationMap = events.reduce((acc, event) => {
          if (!acc[event.region]) {
            acc[event.region] = {
              name: event.region,
              state: getStateFromCity(event.region),
              eventCount: 0,
              events: [],
              image: event.image // Use the first event's image as location image
            };
          }
          acc[event.region].eventCount++;
          acc[event.region].events.push(event);
          return acc;
        }, {});

        setLocations(Object.values(locationMap));
      } catch (error) {
        console.error("Error fetching locations:", error);
>>>>>>> Stashed changes
      } finally {
        setLoading(false);
      }
    };

<<<<<<< Updated upstream
    fetchEvents();
  }, []);

  // Process events to get unique locations with counts
  const locations = useMemo(() => {
    const locationMap = new Map();
    events.forEach(event => {
      if (event.region) {
        const count = locationMap.get(event.region) || 0;
        locationMap.set(event.region, count + 1);
      }
    });

    return Array.from(locationMap.entries()).map(([region, count]) => ({
      name: region,
      count,
      image: events.find(e => e.region === region)?.image || ''
    }));
  }, [events]);

  const filteredLocations = useMemo(() => {
    let filtered = locations.filter(location =>
      location.name.toLowerCase().includes(search.toLowerCase())
=======
    fetchLocations();
  }, []);

  const states = useMemo(() => getUniqueStates(locations), [locations]);

  const filteredLocations = useMemo(() => {
    let filtered = locations.filter(location =>
      (state === 'All' || location.state === state) &&
      (location.name.toLowerCase().includes(search.toLowerCase()) ||
        location.state.toLowerCase().includes(search.toLowerCase()))
>>>>>>> Stashed changes
    );

    if (sort === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
<<<<<<< Updated upstream
    } else if (sort === 'count') {
      filtered = filtered.sort((a, b) => b.count - a.count);
    }

    return filtered;
  }, [locations, search, sort]);
=======
    } else if (sort === 'events') {
      filtered = filtered.sort((a, b) => b.eventCount - a.eventCount);
    }
    return filtered;
  }, [search, state, sort, locations]);

  const getStateFromCity = (city) => {
    const normalizedCity = city.trim().toLowerCase();
    
    const cityToState = {
      'sydney': 'New South Wales',
      'melbourne': 'Victoria',
      'brisbane': 'Queensland',
      'perth': 'Western Australia',
      'adelaide': 'South Australia',
      'hobart': 'Tasmania',
      'darwin': 'Northern Territory',
      'canberra': 'Australian Capital Territory',
      'gold coast': 'Queensland',
      'newcastle': 'New South Wales',
      'wollongong': 'New South Wales',
      'geelong': 'Victoria',
      'townsville': 'Queensland',
      'cairns': 'Queensland',
      'toowoomba': 'Queensland',
      'ballarat': 'Victoria',
      'bendigo': 'Victoria',
      'albury': 'New South Wales',
      'maitland': 'New South Wales',
      'mackay': 'Queensland',
      'sunshine coast': 'Queensland',
      'newman': 'Western Australia',
      'port macquarie': 'New South Wales',
      'tamworth': 'New South Wales',
      'wagga wagga': 'New South Wales',
    };

    if (cityToState[normalizedCity]) {
      return cityToState[normalizedCity];
    }

    const matchingCity = Object.keys(cityToState).find(key => 
      normalizedCity.includes(key) || key.includes(normalizedCity)
    );

    return matchingCity ? cityToState[matchingCity] : 'Unknown';
  };
>>>>>>> Stashed changes

  if (loading) {
    return (
      <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, pt: '100px', textAlign: 'center' }}>
        <Typography variant="h6">Loading locations...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, pt: '100px' }}>
      <Typography variant="h4" fontWeight="bold" color="#9F1B32" mb={3}>
<<<<<<< Updated upstream
        Event Locations
=======
        Popular Locations
>>>>>>> Stashed changes
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search locations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
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
<<<<<<< Updated upstream
=======
          <InputLabel>State</InputLabel>
          <Select
            value={state}
            label="State"
            onChange={e => setState(e.target.value)}
          >
            {states.map(state => (
              <MenuItem key={state} value={state}>{state}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
>>>>>>> Stashed changes
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
        {filteredLocations.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6">No locations found.</Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredLocations.map(location => (
            <Grid item xs={12} key={location.name}>
              <Card sx={{width: { xs: '100%', sm: '80vw' }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 4, boxShadow: '0 2px 8px rgba(22,101,52,0.08)', height: { sm: 180, xs: 'auto' } }}>
                <Box
                  component="img"
                  src={location.image}
                  alt={location.name}
                  sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 180, sm: '100%' }, objectFit: 'cover', borderTopLeftRadius: 4, borderBottomLeftRadius: { sm: 4, xs: 0 }, borderTopRightRadius: { xs: 4, sm: 0 } }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
<<<<<<< Updated upstream
                    <Chip label={`${location.count} Events`} color="success" size="small" sx={{ bgcolor: '#e6f4ea', color: '#166534', fontWeight: 600, minWidth: 110, maxWidth: 140 }} />
=======
                    <Chip 
                      icon={<LocationOnIcon />}
                      label={location.state} 
                      color="primary" 
                      size="small" 
                      sx={{ bgcolor: '#e0e7ff', color: '#034AA6', fontWeight: 600, minWidth: 110, maxWidth: 140 }} 
                    />
                    <Chip 
                      icon={<EventIcon />}
                      label={`${location.eventCount} Events`} 
                      color="success" 
                      size="small" 
                      sx={{ bgcolor: '#e6f4ea', color: '#166534', fontWeight: 600, minWidth: 110, maxWidth: 140 }} 
                    />
>>>>>>> Stashed changes
                  </Stack>
                  <Typography variant="h6" fontWeight="bold" sx={{ whiteSpace: 'normal', wordBreak: 'break-word', mb: 1 }}>
                    {location.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
<<<<<<< Updated upstream
                    Discover {location.count} exciting events in {location.name}
=======
                    Discover {location.eventCount} exciting events in {location.name}, {location.state}
>>>>>>> Stashed changes
                  </Typography>
                  <Box sx={{ mt: 'auto', textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      size="small"
                      component={RouterLink}
                      to={`/events?location=${location.name}`}
                      sx={{ borderRadius: 99, fontWeight: 600, background: '#034AA6', color: 'white', '&:hover': { background: '#033b88' } }}
                    >
                      View Events
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
<<<<<<< Updated upstream
}
=======
} 
>>>>>>> Stashed changes
