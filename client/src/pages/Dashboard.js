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
  Tabs,
  TextField,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
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
  const { user, updateProfile, refreshUser } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  // Profile-related state
  const [universities, setUniversities] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || '',
    university: user?.university?._id || user?.university || '',
    major: user?.major || '',
    year: user?.year || '',
    bio: user?.bio || '',
    interests: user?.interests || []
  });
  const [newInterest, setNewInterest] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const yearOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

  useEffect(() => {
    fetchClubsAndEvents();
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await axios.get('/api/universities');
      setUniversities(response.data.universities || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setUniversities([]);
    }
  };

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
      await refreshUser(); // Refresh user data to get updated memberships
    } catch (error) {
      console.error('Error joining club:', error);
      alert(error.response?.data?.message || 'Failed to join club');
    }
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      await axios.post(`/api/events/${eventId}/register`);
      fetchClubsAndEvents(); // Refresh data
      await refreshUser(); // Refresh user data to get updated event registrations
    } catch (error) {
      console.error('Error registering for event:', error);
      alert(error.response?.data?.message || 'Failed to register for event');
    }
  };

  // Profile-related handlers
  const handleProfileChange = (e) => {
    setProfileFormData({
      ...profileFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !profileFormData.interests.includes(newInterest.trim())) {
      setProfileFormData({
        ...profileFormData,
        interests: [...profileFormData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setProfileFormData({
      ...profileFormData,
      interests: profileFormData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage('');

    const result = await updateProfile(profileFormData);

    if (result.success) {
      setProfileMessage('Profile updated successfully!');
      setIsEditingProfile(false);
    } else {
      setProfileMessage(result.error);
    }

    setProfileLoading(false);
  };

  const handleEditToggle = () => {
    setIsEditingProfile(!isEditingProfile);
    if (!isEditingProfile) {
      // Reset form data when starting to edit
      setProfileFormData({
        name: user?.name || '',
        university: user?.university?._id || user?.university || '',
        major: user?.major || '',
        year: user?.year || '',
        bio: user?.bio || '',
        interests: user?.interests || []
      });
    }
    setProfileMessage('');
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

  // Get user's joined clubs based on clubMemberships in user object
  const userClubs = clubs.filter(club =>
    user?.clubMemberships?.some(membership => membership.club?._id === club._id)
  );

  // Get user's registered events based on eventsAttended in user object
  const userEvents = events.filter(event =>
    user?.eventsAttended?.some(attendance => attendance.event?._id === event._id)
  );

  // Debug: Check if user has club memberships and event attendance data
  React.useEffect(() => {
    console.log('User object:', user);
    console.log('User clubMemberships:', user?.clubMemberships);
    console.log('User eventsAttended:', user?.eventsAttended);
    console.log('Available clubs:', clubs.length);
    console.log('Available events:', events.length);
    console.log('Filtered userClubs:', userClubs.length);
    console.log('Filtered userEvents:', userEvents.length);
  }, [user, clubs, events, userClubs, userEvents]);

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
          <Tab label="My Profile" icon={<PersonIcon />} />
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

        {tabValue === 4 && (
          <Box>
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                width: '100%'
              }}
            >
              {/* Profile Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography component="h1" variant="h4" fontWeight="bold">
                  My Profile
                </Typography>
                <Button
                  onClick={handleEditToggle}
                  startIcon={isEditingProfile ? <SaveIcon /> : <EditIcon />}
                  variant={isEditingProfile ? "contained" : "outlined"}
                >
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>

              {profileMessage && (
                <Alert
                  severity={profileMessage.includes('success') ? 'success' : 'error'}
                  sx={{ width: '100%', mb: 3 }}
                >
                  {profileMessage}
                </Alert>
              )}

              <Grid container spacing={4}>
                {/* Profile Avatar and Basic Info */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        fontSize: '3rem',
                        bgcolor: 'primary.main',
                        mb: 2
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {user?.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      {user?.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.university?.name || user?.university || 'No university set'}
                    </Typography>
                    {user?.major && (
                      <Typography variant="body2" color="text.secondary">
                        {user.major} • {user?.year || 'Year not set'}
                      </Typography>
                    )}
                    <Chip
                      label={user?.role || 'Student'}
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>

                {/* Profile Form */}
                <Grid item xs={12} md={8}>
                  <Box component="form" onSubmit={handleProfileSubmit}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={profileFormData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditingProfile}
                      required
                    />
                    {isEditingProfile ? (
                      <FormControl fullWidth margin="normal" required>
                        <InputLabel>University</InputLabel>
                        <Select
                          name="university"
                          value={profileFormData.university}
                          label="University"
                          onChange={handleProfileChange}
                        >
                          {universities.map((university) => (
                            <MenuItem key={university._id} value={university._id}>
                              {university.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        margin="normal"
                        fullWidth
                        label="University"
                        value={user?.university?.name || 'No university set'}
                        disabled
                      />
                    )}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          margin="normal"
                          fullWidth
                          label="Major/Field of Study"
                          name="major"
                          value={profileFormData.major}
                          onChange={handleProfileChange}
                          disabled={!isEditingProfile}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          margin="normal"
                          fullWidth
                          select
                          label="Academic Year"
                          name="year"
                          value={profileFormData.year}
                          onChange={handleProfileChange}
                          disabled={!isEditingProfile}
                        >
                          {yearOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                    <TextField
                      margin="normal"
                      fullWidth
                      multiline
                      rows={4}
                      label="Bio"
                      name="bio"
                      value={profileFormData.bio}
                      onChange={handleProfileChange}
                      disabled={!isEditingProfile}
                      placeholder="Tell us about yourself..."
                      helperText="Maximum 500 characters"
                    />

                    {/* Interests Section */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Interests
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {profileFormData.interests.map((interest, index) => (
                          <Chip
                            key={index}
                            label={interest}
                            onDelete={isEditingProfile ? () => handleRemoveInterest(interest) : undefined}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      {isEditingProfile && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <TextField
                            size="small"
                            placeholder="Add an interest"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                          />
                          <Button onClick={handleAddInterest} variant="outlined" size="small">
                            Add
                          </Button>
                        </Box>
                      )}
                    </Box>

                    {/* Joined Clubs Section */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupsIcon color="primary" />
                        Joined Clubs ({user?.clubMemberships?.length || 0})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {user?.clubMemberships?.length > 0 ? (
                          user.clubMemberships.map((membership, index) => (
                            <Chip
                              key={index}
                              label={`${membership.club?.name || 'Unknown Club'} (${membership.role || 'Member'})`}
                              color="secondary"
                              variant="outlined"
                              size="small"
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No clubs joined yet
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Attended Events Section */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon color="primary" />
                        Attended Events ({user?.eventsAttended?.length || 0})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {user?.eventsAttended?.length > 0 ? (
                          user.eventsAttended.slice(0, 10).map((attendance, index) => (
                            <Chip
                              key={index}
                              label={`${attendance.event?.title || 'Unknown Event'}`}
                              color="info"
                              variant="outlined"
                              size="small"
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No events attended yet
                          </Typography>
                        )}
                      </Box>
                      {user?.eventsAttended?.length > 10 && (
                        <Typography variant="body2" color="text.secondary">
                          And {user.eventsAttended.length - 10} more events...
                        </Typography>
                      )}
                    </Box>

                    {isEditingProfile && (
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={profileLoading}
                        startIcon={<SaveIcon />}
                      >
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
