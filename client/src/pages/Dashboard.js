import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Button,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Import role-specific components
import AdminDashboard from '../components/AdminDashboard';
import ClubAdminDashboard from '../components/ClubAdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Render different dashboards based on user role
  if (user?.role === 'Administrator') {
    return <AdminDashboard />;
  }

  if (user?.role === 'Club Admin') {
    return <ClubAdminDashboard />;
  }

  // Default Student Dashboard
  return <StudentDashboard />;
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchClubsAndEvents();
  }, []);

  const fetchClubsAndEvents = async () => {
    try {
      const universityId = user?.university?._id || user?.university;
      const [clubsRes, eventsRes] = await Promise.all([
        axios.get(`/api/clubs${universityId ? `?university=${universityId}` : ''}`),
        axios.get(`/api/events${universityId ? `?university=${universityId}` : ''}`)
      ]);

      setClubs(clubsRes.data.clubs || []);
      setEvents(eventsRes.data.events || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setClubs([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      await axios.post(`/api/clubs/${clubId}/join`);
      fetchClubsAndEvents(); // Refresh data
    } catch (error) {
      console.error('Error joining club:', error);
      alert(error.response?.data?.message || 'Failed to join club');
    }
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      await axios.post(`/api/events/${eventId}/register`);
      fetchClubsAndEvents(); // Refresh data
    } catch (error) {
      console.error('Error registering for event:', error);
      alert(error.response?.data?.message || 'Failed to register for event');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const userClubs = clubs.filter(club =>
    club.members?.some(member => member.user._id === user?._id)
  );

  const userEvents = events.filter(event =>
    event.attendees?.some(attendee => attendee._id === user?._id)
  );

  const renderClubs = (clubList) => (
    <Grid container spacing={3}>
      {clubList.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No clubs found
          </Typography>
        </Grid>
      ) : (
        clubList.map((club) => (
          <Grid item xs={12} sm={6} md={4} key={club._id}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      mr: 2,
                      bgcolor: 'primary.main'
                    }}
                  >
                    <GroupsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {club.name}
                    </Typography>
                    <Chip
                      label={club.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {club.description?.length > 100
                    ? `${club.description.substring(0, 100)}...`
                    : club.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Members: {club.members?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  President: {club.president?.name}
                </Typography>
              </CardContent>
              <CardActions>
                {!userClubs.find(uc => uc._id === club._id) ? (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => handleJoinClub(club._id)}
                  >
                    Join Club
                  </Button>
                ) : (
                  <Chip label="Member" color="success" size="small" />
                )}
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  const renderEvents = (eventList) => (
    <Grid container spacing={3}>
      {eventList.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No events found
          </Typography>
        </Grid>
      ) : (
        eventList.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      mr: 2,
                      bgcolor: 'secondary.main'
                    }}
                  >
                    <EventIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {event.title}
                    </Typography>
                    <Chip
                      label={event.type}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {event.description?.length > 100
                    ? `${event.description.substring(0, 100)}...`
                    : event.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(event.startDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.venue?.name || 'TBD'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Organizer: {event.organizer?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Attendees: {event.attendees?.length || 0}
                  {event.capacity && `/${event.capacity}`}
                </Typography>
              </CardContent>
              <CardActions>
                {event.registrationRequired && !userEvents.find(ue => ue._id === event._id) ? (
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRegisterEvent(event._id)}
                  >
                    Register
                  </Button>
                ) : userEvents.find(ue => ue._id === event._id) ? (
                  <Chip label="Registered" color="success" size="small" />
                ) : (
                  <Chip label="Open Event" color="info" size="small" />
                )}
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {user?.university?.name || user?.university} • {user?.major} • {user?.year} • Student Dashboard
        </Typography>
      </Paper>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <GroupsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {clubs.length}
              </Typography>
              <Typography color="text.secondary">
                Active Clubs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <EventIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {events.length}
              </Typography>
              <Typography color="text.secondary">
                Upcoming Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {userClubs.length}
              </Typography>
              <Typography color="text.secondary">
                My Clubs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {userEvents.length}
              </Typography>
              <Typography color="text.secondary">
                My Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
          <Tab label="Featured Clubs" />
          <Tab label="Upcoming Events" />
          <Tab label="My Clubs" />
          <Tab label="My Events" />
        </Tabs>
      </Box>

      {/* Content based on selected tab */}
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Featured Clubs
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Discover and join clubs at your university
            </Typography>
            {loading ? (
              <Typography>Loading clubs...</Typography>
            ) : (
              renderClubs(clubs.slice(0, 6))
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Upcoming Events
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Don't miss out on exciting events happening at your university
            </Typography>
            {loading ? (
              <Typography>Loading events...</Typography>
            ) : (
              renderEvents(events.slice(0, 6))
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              My Clubs
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Clubs you're a member of
            </Typography>
            {renderClubs(userClubs)}
          </Box>
        )}

        {tabValue === 3 && (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              My Events
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Events you're registered for
            </Typography>
            {renderEvents(userEvents)}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
