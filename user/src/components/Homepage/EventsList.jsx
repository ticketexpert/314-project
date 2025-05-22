import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Stack, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Slider, 
  Skeleton,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [date, setDate] = useState(null);
  const [sort, setSort] = useState('title');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const navigate = useNavigate();

  // Reset all filters when component mounts or when navigating to /events
  useEffect(() => {
    // Only reset if we're at the /events path without any query parameters
    if (window.location.pathname === '/events' && !window.location.search) {
      setSearch('');
      setCategory('All');
      setLocation('All');
      setDate(null);
      setSort('title');
    }
  }, [window.location.pathname, window.location.search]);

  // Handle URL parameters on component mount
  useEffect(() => {
    const locationParam = searchParams.get('location');
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const dateParam = searchParams.get('date');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');

    if (locationParam) setLocation(locationParam);
    if (categoryParam) setCategory(categoryParam);
    if (searchParam) setSearch(searchParam);
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
    if (minPriceParam && maxPriceParam) {
      setPriceRange([parseInt(minPriceParam), parseInt(maxPriceParam)]);
    }
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

  const getLowestPrice = (pricing) => {
    if (!pricing || pricing.length === 0) return 'N/A';
    const prices = pricing.map(p => p.price).filter(price => price !== null && price !== undefined);
    return prices.length > 0 ? Math.min(...prices) : 'N/A';
  };

  const getHighestPrice = (pricing) => {
    if (!pricing || pricing.length === 0) return 'N/A';
    const prices = pricing.map(p => p.price).filter(price => price !== null && price !== undefined);
    return prices.length > 0 ? Math.max(...prices) : 'N/A';
  };

  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      // Category and location filtering
      const categoryMatch = category === 'All' || event.category === category;
      const locationMatch = location === 'All' || event.region === location;

      // Date filtering
      const dateMatch = !date || (() => {
        const eventDate = new Date(event.fromDateTime);
        const searchDate = new Date(date);
        return eventDate.toDateString() === searchDate.toDateString();
      })();

      // Price range filtering
      const lowestPrice = getLowestPrice(event.pricing);
      const highestPrice = getHighestPrice(event.pricing);
      const priceMatch = lowestPrice !== 'N/A' && highestPrice !== 'N/A' &&
        lowestPrice >= priceRange[0] && highestPrice <= priceRange[1];

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
          if (word.startsWith(term)) return true;
          if (term.startsWith(word)) return true;
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

      return categoryMatch && locationMatch && dateMatch && searchMatch && priceMatch;
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
  }, [search, category, location, date, sort, events, priceRange]);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory('All');
    setLocation('All');
    setDate(null);
    setSort('title');
    setPriceRange([0, 1000]);
    window.history.replaceState(null, '', window.location.pathname);
  };

  const hasActiveFilters = () => {
    return search !== '' || 
           category !== 'All' || 
           location !== 'All' || 
           date !== null || 
           priceRange[0] > 0 || 
           priceRange[1] < 1000;
  };

  // Update URL when filters change
  const updateURL = (newLocation, newCategory, newSearch, newDate, newPriceRange) => {
    const params = new URLSearchParams();
    if (newLocation !== 'All') params.set('location', newLocation);
    if (newCategory !== 'All') params.set('category', newCategory);
    if (newSearch) params.set('search', newSearch);
    if (newDate) {
      const formattedDate = newDate.toISOString().split('T')[0];
      params.set('date', formattedDate);
    }
    if (newPriceRange[0] > 0) params.set('minPrice', newPriceRange[0]);
    if (newPriceRange[1] < 1000) params.set('maxPrice', newPriceRange[1]);
    window.history.replaceState(null, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleLocationChange = (newLocation) => {
    if (newLocation === 'All') {
      // Reset all filters
      setLocation('All');
      setCategory('All');
      setDate(null);
      setSearch('');
      // Update URL to remove all parameters
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      setLocation(newLocation);
      updateURL(newLocation, category, search, date, priceRange);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    updateURL(location, newCategory, search, date, priceRange);
  };

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    updateURL(location, category, newSearch, date, priceRange);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    updateURL(location, category, search, newDate, priceRange);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    updateURL(location, category, search, date, newValue);
  };

  const renderLoadingSkeletons = () => (
    <Grid container spacing={3}>
      {[1, 2, 3].map((index) => (
        <Grid item xs={12} key={index}>
          <Card sx={{ width: { xs: '100%', sm: '80vw' }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 4, height: { sm: 180, xs: 'auto' } }}>
            <Skeleton variant="rectangular" width={200} height={180} sx={{ borderTopLeftRadius: 4, borderBottomLeftRadius: { sm: 4, xs: 0 }, borderTopRightRadius: { xs: 4, sm: 0 } }} />
            <CardContent sx={{ flex: 1, p: 2 }}>
              <Stack direction="row" spacing={1} mb={1}>
                <Skeleton variant="rounded" width={110} height={24} />
                <Skeleton variant="rounded" width={110} height={24} />
                <Skeleton variant="rounded" width={110} height={24} />
              </Stack>
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
              <Box sx={{ mt: 'auto', textAlign: 'right' }}>
                <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: 99 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderNoResults = () => (
    <Card sx={{ width: { xs: '100%', sm: '80vw' }, p: 4, textAlign: 'center' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>No events found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {hasActiveFilters() 
            ? "Try adjusting your filters or search terms"
            : "There are currently no events available"}
        </Typography>
        <br/>
        {hasActiveFilters() && (
          <Button
            variant="outlined"
            onClick={clearAllFilters}
            startIcon={<ClearIcon />}
            sx={{ mt: 2 }}
          >
            Clear All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, pt: '100px' }}>
        <Typography variant="h4" fontWeight="bold" color="#9F1B32" mb={3}>
          All Events
        </Typography>
        {renderLoadingSkeletons()}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', maxWidth: 1200, mx: 'auto', my: 4, px: { xs: 1, md: 3 }, pt: '100px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="#9F1B32">
          {location !== 'All' ? `Events in ${location}` : 'All Events'}
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setShowFilters(!showFilters)} color="primary">
            <FilterListIcon />
          </IconButton>
        )}
      </Box>

      {showFilters && (
        <>
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
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => handleSearchChange('')}>
                      <ClearIcon />
                    </IconButton>
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

          <Box sx={{ width: '100%', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography>
                Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </Typography>
              {hasActiveFilters() && (
                <Button
                  size="small"
                  onClick={clearAllFilters}
                  startIcon={<ClearIcon />}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
            <Box sx={{ position: 'relative', px: 2 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                valueLabelFormat={formatPrice}
                min={0}
                max={1000}
                step={10}
                sx={{
                  color: '#9F1B32',
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0px 0px 0px 8px rgba(159, 27, 50, 0.16)'
                    }
                  },
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: '#9F1B32',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    '&:before': {
                      display: 'none'
                    }
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(159, 27, 50, 0.1)',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'opacity 0.2s',
                  opacity: 0,
                  '&:hover': {
                    opacity: 1
                  }
                }}
              >
                <Typography variant="body2" sx={{ color: '#9F1B32', fontWeight: 500 }}>
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}

      <Grid container spacing={3}>
        {filteredEvents.length === 0 ? (
          <Grid item xs={12}>
            {renderNoResults()}
          </Grid>
        ) : (
          filteredEvents.map(event => (
            <Grid item xs={12} key={event.eventId}>
              <Card sx={{
                width: { xs: '100%', sm: '80vw' },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(22,101,52,0.08)',
                height: { sm: 180, xs: 'auto' },
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(22,101,52,0.12)',
                }
              }}>
                <Box
                  component="img"
                  src={event.image}
                  alt={event.title}
                  sx={{
                    width: { xs: '100%', sm: 200 },
                    height: { xs: 180, sm: '100%' },
                    objectFit: 'cover',
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: { sm: 4, xs: 0 },
                    borderTopRightRadius: { xs: 4, sm: 0 }
                  }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                    <Chip
                      label={event.category.toUpperCase()}
                      color="success"
                      size="small"
                      sx={{ bgcolor: '#e6f4ea', color: '#166534', fontWeight: 600, minWidth: 110, maxWidth: 140 }}
                    />
                    <Chip
                      label={formatDate(event.fromDateTime)}
                      color="primary"
                      size="small"
                      sx={{ bgcolor: '#e0e7ff', color: '#034AA6', fontWeight: 600, minWidth: 110, maxWidth: 140 }}
                    />
                    <Chip
                      label={`Ticket from ${formatPrice(getLowestPrice(event.pricing))}`}
                      size="small"
                      sx={{ bgcolor: '#fbe9eb', color: '#9F1B32', fontWeight: 500, minWidth: 110, maxWidth: 140 }}
                    />
                    <Chip
                      label={event.region}
                      size="small"
                      sx={{ bgcolor: '#f3e8ff', color: '#6b21a8', fontWeight: 500, minWidth: 110, maxWidth: 140 }}
                    />
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
                      sx={{
                        borderRadius: 99,
                        fontWeight: 600,
                        background: '#034AA6',
                        color: 'white',
                        '&:hover': { background: '#033b88' }
                      }}
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