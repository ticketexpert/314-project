import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Stack, 
  Container, 
  Paper, 
  Grid, 
  TextField, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'location', label: 'Location' },
];

export default function OrganisationsList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [organisations, setOrganisations] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('All');
  const [sort, setSort] = useState('name');
  const [showFilters, setShowFilters] = useState(!isMobile);

  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const response = await fetch('https://api.ticketexpert.me/api/organisations');
        if (!response.ok) {
          throw new Error('Failed to fetch organisations');
        }
        const data = await response.json();
        setOrganisations(data);
        setFilteredOrgs(data);
      } catch (error) {
        console.error('Error fetching organisations:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisations();
  }, []);

  const locations = ['All', ...Array.from(new Set(organisations.map(org => org.contact)))];

  useEffect(() => {
    let filtered = organisations.filter(org => {
      const searchMatch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.contact.toLowerCase().includes(searchQuery.toLowerCase());
      const locationMatch = location === 'All' || org.contact === location;
      return searchMatch && locationMatch;
    });

    if (sort === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'location') {
      filtered = filtered.sort((a, b) => a.contact.localeCompare(b.contact));
    }

    setFilteredOrgs(filtered);
  }, [searchQuery, organisations, location, sort]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setLocation('All');
    setSort('name');
  };

  const hasActiveFilters = () => {
    return searchQuery !== '' || location !== 'All';
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, pt: '100px' }}>
        <Typography variant="h4" fontWeight="bold" color={colorScheme.blue.primary} mb={3}>
          All Organisations
        </Typography>
        <Typography variant="h6">Loading organisations...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, pt: '100px' }}>
        <Typography variant="h4" fontWeight="bold" color={colorScheme.blue.primary} mb={3}>
          All Organisations
        </Typography>
        <Typography variant="h6" color="error">Error Loading Organisations</Typography>
        <Typography variant="body1" color="text.secondary">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100vw',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        width: '70%', 
        px: { xs: 2, md: 4 }, 
        pt: '100px',
        mx: 'auto'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color={colorScheme.blue.primary}>
            {location !== 'All' ? `Organisations in ${location}` : 'All Organisations'}
          </Typography>
          {isMobile && (
            <IconButton onClick={() => setShowFilters(!showFilters)} color="primary">
              <FilterListIcon />
            </IconButton>
          )}
        </Box>

        {showFilters && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
            <TextField
              variant="outlined"
              placeholder="Search organisations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 220, flex: 2 }}
            />
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Location</InputLabel>
              <Select
                value={location}
                label="Location"
                onChange={(e) => setLocation(e.target.value)}
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
                onChange={(e) => setSort(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {hasActiveFilters() && (
              <Button
                variant="outlined"
                onClick={clearAllFilters}
                startIcon={<ClearIcon />}
                sx={{ minWidth: 160 }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>
        )}

        <Grid container spacing={3}>
          {filteredOrgs.length === 0 ? (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: colorScheme.yellow.light }}>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  No organisations found matching your search.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            filteredOrgs.map((org) => (
              <Grid item xs={12} key={org.eventOrgId}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    width: { xs: '70vw', sm: '70vw' },
                    display: 'flex',
                    flexDirection: 'row',
                    borderRadius: 4,
                    boxShadow: '0 2px 8px rgba(22,101,52,0.08)',
                    height: { sm: 180, xs: 'auto' },
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(22,101,52,0.12)',
                    }
                  }}
                >
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                    <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                      <Chip
                        label={org.name.toUpperCase()}
                        color="success"
                        size="small"
                        sx={{ bgcolor: '#e6f4ea', color: '#166534', fontWeight: 600, minWidth: 110, maxWidth: 140 }}
                      />
                      <Chip
                        label={org.contact}
                        color="primary"
                        size="small"
                        sx={{ bgcolor: '#e0e7ff', color: '#034AA6', fontWeight: 600, minWidth: 110, maxWidth: 140 }}
                      />
                    </Stack>

                    <Typography variant="h6" fontWeight="bold" sx={{ whiteSpace: 'normal', wordBreak: 'break-word', mb: 1 }}>
                      {org.name}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      mb={2}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {org.description}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                      <LocationOnIcon sx={{ color: colorScheme.blue.primary, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {org.contact}
                      </Typography>
                    </Stack>

                    <Box sx={{ mt: 'auto', textAlign: 'right' }}>
                      <Button 
                        variant="contained" 
                        component={RouterLink}
                        to={`/organisation/${org.eventOrgId}`}
                        sx={{ 
                          bgcolor: colorScheme.blue.primary,
                          borderRadius: 99,
                          fontWeight: 600,
                          '&:hover': { 
                            bgcolor: colorScheme.blue.hover,
                          }
                        }}
                      >
                        View Organisation
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
} 