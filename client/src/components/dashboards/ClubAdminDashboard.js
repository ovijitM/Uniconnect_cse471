import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    CardHeader,
    CardActions,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Club Admin Dashboard Component for Club Administrators
const ClubAdminDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    // Data States
    const [myClubs, setMyClubs] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [universities, setUniversities] = useState([]);

    // Dialog States
    const [clubFormOpen, setClubFormOpen] = useState(false);
    const [eventFormOpen, setEventFormOpen] = useState(false);
    const [memberManagementOpen, setMemberManagementOpen] = useState(false);
    const [attendeeManagementOpen, setAttendeeManagementOpen] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Statistics
    const [stats, setStats] = useState({
        totalClubs: 0,
        totalEvents: 0,
        totalMembers: 0,
        upcomingEvents: 0
    });

    useEffect(() => {
        fetchData();
        fetchUniversities();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [clubsRes, eventsRes] = await Promise.all([
                axios.get('/api/clubs/managed'),
                axios.get('/api/events/managed')
            ]);

            const clubs = clubsRes.data.clubs || [];
            const events = eventsRes.data.events || [];

            setMyClubs(clubs);
            setMyEvents(events);

            // Calculate stats
            const totalMembers = clubs.reduce((sum, club) => sum + (club.members?.length || 0), 0);
            const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date()).length;

            setStats({
                totalClubs: clubs.length,
                totalEvents: events.length,
                totalMembers,
                upcomingEvents
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUniversities = async () => {
        try {
            const response = await axios.get('/api/universities');
            setUniversities(response.data.universities || []);
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    };

    // Club Operations
    const handleCreateClub = () => {
        setSelectedClub(null);
        setEditMode(false);
        setClubFormOpen(true);
    };

    const handleEditClub = (club) => {
        setSelectedClub(club);
        setEditMode(true);
        setClubFormOpen(true);
    };

    const handleManageMembers = (club) => {
        setSelectedClub(club);
        setMemberManagementOpen(true);
    };

    // Event Operations
    const handleCreateEvent = () => {
        setSelectedEvent(null);
        setEditMode(false);
        setEventFormOpen(true);
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setEditMode(true);
        setEventFormOpen(true);
    };

    const handleManageAttendees = (event) => {
        setSelectedEvent(event);
        setAttendeeManagementOpen(true);
    };

    const handleClubFormClose = () => {
        setClubFormOpen(false);
        setSelectedClub(null);
        setEditMode(false);
        fetchData(); // Refresh data
    };

    const handleEventFormClose = () => {
        setEventFormOpen(false);
        setSelectedEvent(null);
        setEditMode(false);
        fetchData(); // Refresh data
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h4" sx={{ ml: 2 }}>
                    Loading Club Admin Dashboard...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Club Admin Dashboard 🏆
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Welcome, {user?.name} - Manage your clubs and events
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                            onClick={handleCreateClub}
                        >
                            New Club
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                            onClick={handleCreateEvent}
                        >
                            New Event
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <GroupsIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        My Clubs
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.totalClubs}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                    <EventIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        My Events
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.totalEvents}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Members
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.totalMembers}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <ScheduleIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Upcoming Events
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.upcomingEvents}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content Tabs */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                        <Tab label="My Clubs" />
                        <Tab label="My Events" />
                        <Tab label="Analytics" />
                    </Tabs>
                </Box>

                {/* Clubs Tab */}
                {tabValue === 0 && (
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">
                                My Clubs ({myClubs.length})
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleCreateClub}
                            >
                                Create New Club
                            </Button>
                        </Box>

                        {myClubs.length === 0 ? (
                            <Box textAlign="center" py={4}>
                                <GroupsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No clubs yet
                                </Typography>
                                <Typography color="text.secondary" gutterBottom>
                                    Create your first club to start managing members and events
                                </Typography>
                                <Button variant="contained" onClick={handleCreateClub}>
                                    Create Club
                                </Button>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {myClubs.map((club) => (
                                    <Grid item xs={12} md={6} key={club._id}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Box display="flex" alignItems="center" mb={2}>
                                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                        {club.name.charAt(0)}
                                                    </Avatar>
                                                    <Box flexGrow={1}>
                                                        <Typography variant="h6">
                                                            {club.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {club.category}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={club.isActive ? 'Active' : 'Inactive'}
                                                        color={club.isActive ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </Box>

                                                <Typography variant="body2" paragraph>
                                                    {club.description}
                                                </Typography>

                                                <Box display="flex" justifyContent="space-between" mb={2}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        👥 {club.members?.length || 0} members
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        💰 ${club.membershipFee || 0}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleEditClub(club)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<PersonIcon />}
                                                    onClick={() => handleManageMembers(club)}
                                                >
                                                    Members
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<VisibilityIcon />}
                                                    component={Link}
                                                    to={`/clubs/${club._id}`}
                                                >
                                                    View
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </CardContent>
                )}

                {/* Events Tab */}
                {tabValue === 1 && (
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">
                                My Events ({myEvents.length})
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleCreateEvent}
                                disabled={myClubs.length === 0}
                            >
                                Create New Event
                            </Button>
                        </Box>

                        {myClubs.length === 0 ? (
                            <Box textAlign="center" py={4}>
                                <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Create a club first
                                </Typography>
                                <Typography color="text.secondary">
                                    You need to create a club before you can create events
                                </Typography>
                            </Box>
                        ) : myEvents.length === 0 ? (
                            <Box textAlign="center" py={4}>
                                <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No events yet
                                </Typography>
                                <Typography color="text.secondary" gutterBottom>
                                    Create your first event for your clubs
                                </Typography>
                                <Button variant="contained" onClick={handleCreateEvent}>
                                    Create Event
                                </Button>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {myEvents.map((event) => (
                                    <Grid item xs={12} md={6} key={event._id}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                    <Typography variant="h6">
                                                        {event.title}
                                                    </Typography>
                                                    <Chip
                                                        label={new Date(event.startDate) > new Date() ? 'Upcoming' : 'Past'}
                                                        color={new Date(event.startDate) > new Date() ? 'primary' : 'default'}
                                                        size="small"
                                                    />
                                                </Box>

                                                <Typography variant="body2" color="primary" gutterBottom>
                                                    {event.club?.name}
                                                </Typography>

                                                <Typography variant="body2" paragraph>
                                                    {event.description}
                                                </Typography>

                                                <Box display="flex" flexDirection="column" gap={1} mb={2}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        📅 {new Date(event.startDate).toLocaleDateString()}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        🕒 {event.startTime} - {event.endTime}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        📍 {event.venue}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        👥 {event.attendees?.length || 0} attendees
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleEditEvent(event)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<PersonIcon />}
                                                    onClick={() => handleManageAttendees(event)}
                                                >
                                                    Attendees
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<VisibilityIcon />}
                                                    component={Link}
                                                    to={`/events/${event._id}`}
                                                >
                                                    View
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </CardContent>
                )}

                {/* Analytics Tab */}
                {tabValue === 2 && (
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Analytics & Reports
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Club Statistics
                                        </Typography>
                                        <Box display="flex" flexDirection="column" gap={2}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography>Total Clubs:</Typography>
                                                <Typography fontWeight="bold">{stats.totalClubs}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography>Total Members:</Typography>
                                                <Typography fontWeight="bold">{stats.totalMembers}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography>Avg Members per Club:</Typography>
                                                <Typography fontWeight="bold">
                                                    {stats.totalClubs > 0 ? Math.round(stats.totalMembers / stats.totalClubs) : 0}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Event Statistics
                                        </Typography>
                                        <Box display="flex" flexDirection="column" gap={2}>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography>Total Events:</Typography>
                                                <Typography fontWeight="bold">{stats.totalEvents}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography>Upcoming Events:</Typography>
                                                <Typography fontWeight="bold">{stats.upcomingEvents}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography>Past Events:</Typography>
                                                <Typography fontWeight="bold">{stats.totalEvents - stats.upcomingEvents}</Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                )}
            </Card>

            {/* Note: Club Form, Event Form, Member Management, and Attendee Management dialogs would be here */}
            {/* For brevity, I'll add placeholders for these complex components */}

            {/* Placeholder dialogs - you would implement full dialog components here */}
            <Dialog open={clubFormOpen} onClose={handleClubFormClose} maxWidth="md" fullWidth>
                <DialogTitle>{editMode ? 'Edit Club' : 'Create New Club'}</DialogTitle>
                <DialogContent>
                    <Typography>Club form would be implemented here...</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClubFormClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={eventFormOpen} onClose={handleEventFormClose} maxWidth="md" fullWidth>
                <DialogTitle>{editMode ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                <DialogContent>
                    <Typography>Event form would be implemented here...</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEventFormClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={memberManagementOpen} onClose={() => setMemberManagementOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Manage Members</DialogTitle>
                <DialogContent>
                    <Typography>Member management interface would be implemented here...</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMemberManagementOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={attendeeManagementOpen} onClose={() => setAttendeeManagementOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Manage Attendees</DialogTitle>
                <DialogContent>
                    <Typography>Attendee management interface would be implemented here...</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAttendeeManagementOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ClubAdminDashboard;
