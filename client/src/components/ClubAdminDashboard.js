import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Paper,
    Button,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const ClubAdminDashboard = () => {
    const { user } = useAuth();
    const [myClubs, setMyClubs] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createEventDialog, setCreateEventDialog] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        type: 'Workshop',
        organizer: '',
        startDate: '',
        endDate: '',
        venue: { name: '', address: '' },
        capacity: '',
        registrationRequired: true,
        entryFee: 0
    });

    const eventTypes = ['Workshop', 'Seminar', 'Competition', 'Social Event', 'Meeting', 'Conference', 'Sports', 'Cultural', 'Academic', 'Other'];

    useEffect(() => {
        fetchClubAdminData();
    }, []);

    const fetchClubAdminData = async () => {
        try {
            const [clubsRes, eventsRes] = await Promise.all([
                axios.get('/clubs'),
                axios.get('/events')
            ]);

            // Filter clubs where user is president or officer
            const userClubs = clubsRes.data.clubs?.filter(club =>
                club.members?.some(member =>
                    member.user._id === user?._id &&
                    ['President', 'Vice President', 'Officer', 'Secretary'].includes(member.role)
                )
            ) || [];

            // Filter events organized by user's clubs
            const clubIds = userClubs.map(club => club._id);
            const userEvents = eventsRes.data.events?.filter(event =>
                clubIds.includes(event.organizer?._id)
            ) || [];

            setMyClubs(userClubs);
            setMyEvents(userEvents);
            setAllEvents(eventsRes.data.events || []);
        } catch (error) {
            console.error('Error fetching club admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async () => {
        try {
            await axios.post('/events', newEvent);
            setCreateEventDialog(false);
            resetNewEvent();
            fetchClubAdminData();
        } catch (error) {
            console.error('Error creating event:', error);
            alert(error.response?.data?.message || 'Failed to create event');
        }
    };

    const resetNewEvent = () => {
        setNewEvent({
            title: '',
            description: '',
            type: 'Workshop',
            organizer: '',
            startDate: '',
            endDate: '',
            venue: { name: '', address: '' },
            capacity: '',
            registrationRequired: true,
            entryFee: 0
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
            {/* Welcome Section */}
            <Paper
                sx={{
                    p: 4,
                    mb: 4,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    borderRadius: 2
                }}
            >
                <Typography variant="h3" gutterBottom fontWeight="bold">
                    Club Admin Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Welcome, {user?.name} - Manage your clubs and events
                </Typography>
            </Paper>

            {/* Stats Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <CardContent>
                            <GroupsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {myClubs.length}
                            </Typography>
                            <Typography color="text.secondary">
                                My Clubs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <CardContent>
                            <EventIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {myEvents.length}
                            </Typography>
                            <Typography color="text.secondary">
                                My Events
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <CardContent>
                            <Typography variant="h4" fontWeight="bold" color="success.main">
                                {myEvents.reduce((total, event) => total + (event.attendees?.length || 0), 0)}
                            </Typography>
                            <Typography color="text.secondary">
                                Total Attendees
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* My Clubs Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    My Clubs
                </Typography>
                <Grid container spacing={3}>
                    {myClubs.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="text.secondary" textAlign="center">
                                You are not managing any clubs yet.
                            </Typography>
                        </Grid>
                    ) : (
                        myClubs.map((club) => (
                            <Grid item xs={12} sm={6} md={4} key={club._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {club.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {club.description?.length > 100
                                                ? `${club.description.substring(0, 100)}...`
                                                : club.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Members: {club.members?.length || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Category: {club.category}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" variant="outlined">
                                            Manage
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>

            {/* My Events Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    My Events
                </Typography>
                <Grid container spacing={3}>
                    {myEvents.length === 0 ? (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="text.secondary" textAlign="center">
                                No events created yet. Click the + button to create your first event!
                            </Typography>
                        </Grid>
                    ) : (
                        myEvents.map((event) => (
                            <Grid item xs={12} sm={6} md={4} key={event._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {event.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {event.description?.length > 80
                                                ? `${event.description.substring(0, 80)}...`
                                                : event.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(event.startDate)}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Attendees: {event.attendees?.length || 0}
                                            {event.capacity && `/${event.capacity}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Organizer: {event.organizer?.name}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" variant="outlined">
                                            Manage
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>

            {/* Floating Action Button for Creating Event */}
            {myClubs.length > 0 && (
                <Fab
                    color="secondary"
                    aria-label="create event"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    onClick={() => setCreateEventDialog(true)}
                >
                    <AddIcon />
                </Fab>
            )}

            {/* Create Event Dialog */}
            <Dialog
                open={createEventDialog}
                onClose={() => setCreateEventDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Create New Event</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Event Title"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Event Type</InputLabel>
                                    <Select
                                        value={newEvent.type}
                                        label="Event Type"
                                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                    >
                                        {eventTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Organizing Club</InputLabel>
                                    <Select
                                        value={newEvent.organizer}
                                        label="Organizing Club"
                                        onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                                    >
                                        {myClubs.map((club) => (
                                            <MenuItem key={club._id} value={club._id}>
                                                {club.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Venue Name"
                                    value={newEvent.venue.name}
                                    onChange={(e) => setNewEvent({
                                        ...newEvent,
                                        venue: { ...newEvent.venue, name: e.target.value }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Start Date & Time"
                                    type="datetime-local"
                                    InputLabelProps={{ shrink: true }}
                                    value={newEvent.startDate}
                                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="End Date & Time"
                                    type="datetime-local"
                                    InputLabelProps={{ shrink: true }}
                                    value={newEvent.endDate}
                                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateEventDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreateEvent}
                        variant="contained"
                        disabled={!newEvent.title || !newEvent.description || !newEvent.organizer}
                    >
                        Create Event
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ClubAdminDashboard;
