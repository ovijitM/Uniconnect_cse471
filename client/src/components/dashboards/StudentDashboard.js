import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Avatar,
    CardActions,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Student Dashboard Component for Regular Students
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
    const [profileMessage, setProfileMessage] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);

    const yearOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

    const fetchClubsAndEvents = useCallback(async () => {
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
    }, [user]);

    useEffect(() => {
        fetchClubsAndEvents();
        fetchUniversities();
    }, [fetchClubsAndEvents]);

    const fetchUniversities = async () => {
        try {
            const response = await axios.get('/api/universities');
            setUniversities(response.data.universities || []);
        } catch (error) {
            console.error('Error fetching universities:', error);
            setUniversities([]);
        }
    };

    const handleJoinClub = async (clubId) => {
        try {
            await axios.post(`/api/clubs/${clubId}/join`);
            fetchClubsAndEvents();
            await refreshUser();
            alert('Successfully joined the club!');
        } catch (error) {
            console.error('Error joining club:', error);
            alert(error.response?.data?.message || 'Failed to join club');
        }
    };

    const handleRegisterEvent = async (eventId) => {
        try {
            await axios.post(`/api/events/${eventId}/register`);
            fetchClubsAndEvents();
            await refreshUser();
            alert('Successfully registered for the event!');
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

    // Get user's joined clubs
    const userClubs = clubs.filter(club =>
        user?.clubMemberships?.some(membership => membership.club?._id === club._id)
    );

    // Get user's registered events
    const userEvents = events.filter(event =>
        user?.eventsAttended?.some(attendance => attendance.event?._id === event._id)
    );

    const renderClubs = (clubList) => (
        <Grid container spacing={3}>
            {clubList.length === 0 ? (
                <Grid item xs={12}>
                    <Box textAlign="center" py={4}>
                        <GroupsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            {tabValue === 0 ? 'You haven\'t joined any clubs yet' : 'No clubs found'}
                        </Typography>
                        <Typography color="text.secondary">
                            {tabValue === 0 ? 'Explore clubs to find ones that interest you!' : 'Check back later for new clubs'}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                clubList.map((club) => (
                    <Grid item xs={12} sm={6} md={4} key={club._id}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                                        <GroupsIcon />
                                    </Avatar>
                                    <Box flexGrow={1}>
                                        <Typography variant="h6" fontWeight="bold" noWrap>
                                            {club.name}
                                        </Typography>
                                        <Chip label={club.category} size="small" color="primary" variant="outlined" />
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                                    {club.description?.length > 100 ?
                                        `${club.description.substring(0, 100)}...` :
                                        club.description || 'No description available'
                                    }
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        👥 {club.members?.length || 0} members
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        💰 ${club.membershipFee || 0}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    🎯 President: {club.president?.name || 'TBD'}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                {!userClubs.find(uc => uc._id === club._id) ? (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<PersonAddIcon />}
                                        onClick={() => handleJoinClub(club._id)}
                                        fullWidth
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
                    <Box textAlign="center" py={4}>
                        <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            {tabValue === 0 ? 'You haven\'t registered for any events yet' : 'No events found'}
                        </Typography>
                        <Typography color="text.secondary">
                            {tabValue === 0 ? 'Discover exciting events to attend!' : 'Check back later for upcoming events'}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                eventList.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'secondary.main' }}>
                                        <EventIcon />
                                    </Avatar>
                                    <Box flexGrow={1}>
                                        <Typography variant="h6" fontWeight="bold" noWrap>
                                            {event.title}
                                        </Typography>
                                        <Chip
                                            label={event.eventType || event.type || 'Event'}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                                    {event.description?.length > 100 ?
                                        `${event.description.substring(0, 100)}...` :
                                        event.description || 'No description available'
                                    }
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(event.startDate)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {event.venue?.name || event.venue || 'TBD'}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        👥 {event.attendees?.length || 0} attendees
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        💰 ${event.registrationFee || 0}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary">
                                    🏛️ {event.club?.name || 'Unknown Club'}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                {event.registrationRequired && !userEvents.find(ue => ue._id === event._id) ? (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleRegisterEvent(event._id)}
                                        fullWidth
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

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h4" sx={{ ml: 2 }}>
                    Loading Your Dashboard...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Welcome Header */}
            <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Typography variant="h3" fontWeight="bold">
                    Welcome, {user?.name}! 👋
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {user?.university?.name || 'University'} • {user?.major || 'Student'} • {user?.year || 'Year N/A'}
                </Typography>
            </Paper>

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                                <GroupsIcon />
                            </Avatar>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                                {userClubs.length}
                            </Typography>
                            <Typography color="text.secondary">
                                My Clubs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                                <EventIcon />
                            </Avatar>
                            <Typography variant="h4" color="secondary" fontWeight="bold">
                                {userEvents.length}
                            </Typography>
                            <Typography color="text.secondary">
                                Registered Events
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                                <GroupsIcon />
                            </Avatar>
                            <Typography variant="h4" color="success.main" fontWeight="bold">
                                {clubs.length}
                            </Typography>
                            <Typography color="text.secondary">
                                Available Clubs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                                <EventIcon />
                            </Avatar>
                            <Typography variant="h4" color="info.main" fontWeight="bold">
                                {events.length}
                            </Typography>
                            <Typography color="text.secondary">
                                Available Events
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab label="My Dashboard" />
                    <Tab label="All Clubs" />
                    <Tab label="All Events" />
                    <Tab label="My Profile" />
                </Tabs>
            </Box>

            {/* My Dashboard Tab */}
            {tabValue === 0 && (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>
                            📚 My Clubs ({userClubs.length})
                        </Typography>
                        {renderClubs(userClubs)}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>
                            🎉 My Events ({userEvents.length})
                        </Typography>
                        {renderEvents(userEvents)}
                    </Grid>
                </Grid>
            )}

            {/* All Clubs Tab */}
            {tabValue === 1 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        All Clubs ({clubs.length})
                    </Typography>
                    {renderClubs(clubs)}
                </Box>
            )}

            {/* All Events Tab */}
            {tabValue === 2 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        All Events ({events.length})
                    </Typography>
                    {renderEvents(events)}
                </Box>
            )}

            {/* My Profile Tab */}
            {tabValue === 3 && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        My Profile
                    </Typography>
                    <Card>
                        <CardContent>
                            {profileMessage && (
                                <Alert
                                    severity={profileMessage.includes('successfully') ? 'success' : 'error'}
                                    sx={{ mb: 2 }}
                                >
                                    {profileMessage}
                                </Alert>
                            )}
                            <Box component="form" onSubmit={handleProfileSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="name"
                                            label="Full Name"
                                            value={profileFormData.name}
                                            onChange={handleProfileChange}
                                            fullWidth
                                            disabled={!isEditingProfile}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth disabled={!isEditingProfile}>
                                            <InputLabel>University</InputLabel>
                                            <Select
                                                name="university"
                                                value={profileFormData.university}
                                                onChange={handleProfileChange}
                                                label="University"
                                            >
                                                {universities.map((uni) => (
                                                    <MenuItem key={uni._id} value={uni._id}>
                                                        {uni.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="major"
                                            label="Major"
                                            value={profileFormData.major}
                                            onChange={handleProfileChange}
                                            fullWidth
                                            disabled={!isEditingProfile}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth disabled={!isEditingProfile}>
                                            <InputLabel>Year</InputLabel>
                                            <Select
                                                name="year"
                                                value={profileFormData.year}
                                                onChange={handleProfileChange}
                                                label="Year"
                                            >
                                                {yearOptions.map((year) => (
                                                    <MenuItem key={year} value={year}>
                                                        {year}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="bio"
                                            label="Bio"
                                            value={profileFormData.bio}
                                            onChange={handleProfileChange}
                                            multiline
                                            rows={3}
                                            fullWidth
                                            disabled={!isEditingProfile}
                                            placeholder="Tell us about yourself..."
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    {!isEditingProfile ? (
                                        <Button
                                            variant="contained"
                                            startIcon={<EditIcon />}
                                            onClick={handleEditToggle}
                                        >
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <>
                                            <Button onClick={handleEditToggle}>
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                startIcon={profileLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                                                disabled={profileLoading}
                                            >
                                                {profileLoading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Container>
    );
};

export default StudentDashboard;
