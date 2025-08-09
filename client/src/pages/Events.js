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
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Pagination,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

const Events = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('All');
    const [clubFilter, setClubFilter] = useState('All');
    const [upcomingOnly, setUpcomingOnly] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        type: 'Workshop',
        organizer: '',
        startDate: dayjs(),
        endDate: dayjs().add(2, 'hour'),
        venue: {
            name: '',
            address: ''
        },
        capacity: '',
        registrationRequired: true,
        registrationDeadline: dayjs().add(1, 'day'),
        entryFee: 0,
        requirements: '',
        contactInfo: ''
    });

    const eventTypes = [
        'All', 'Workshop', 'Seminar', 'Competition', 'Social Event', 'Meeting',
        'Conference', 'Sports', 'Cultural', 'Academic', 'Other'
    ];

    useEffect(() => {
        fetchEvents();
        fetchClubs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, type, clubFilter, upcomingOnly]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '9',
                upcoming: upcomingOnly.toString()
            });

            if (search) params.append('search', search);
            if (type && type !== 'All') params.append('type', type);
            if (clubFilter && clubFilter !== 'All') params.append('club', clubFilter);

            const response = await axios.get(`/api/events?${params}`);
            setEvents(response.data.events || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchClubs = async () => {
        try {
            const response = await axios.get('/api/clubs');
            setClubs(response.data.clubs || []);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            setClubs([]);
        }
    };

    const handleRegisterEvent = async (eventId) => {
        try {
            await axios.post(`/api/events/${eventId}/register`);
            fetchEvents(); // Refresh data
        } catch (error) {
            console.error('Error registering for event:', error);
            alert(error.response?.data?.message || 'Failed to register for event');
        }
    };

    const handleCreateEvent = async () => {
        try {
            const eventData = {
                ...newEvent,
                startDate: newEvent.startDate.toISOString(),
                endDate: newEvent.endDate.toISOString(),
                registrationDeadline: newEvent.registrationDeadline.toISOString(),
                capacity: newEvent.capacity ? parseInt(newEvent.capacity) : undefined
            };

            await axios.post('/api/events', eventData);
            setCreateDialogOpen(false);
            resetNewEvent();
            fetchEvents(); // Refresh data
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
            startDate: dayjs(),
            endDate: dayjs().add(2, 'hour'),
            venue: {
                name: '',
                address: ''
            },
            capacity: '',
            registrationRequired: true,
            registrationDeadline: dayjs().add(1, 'day'),
            entryFee: 0,
            requirements: '',
            contactInfo: ''
        });
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

    const isUserRegistered = (event) => {
        return event.attendees?.some(attendee => attendee._id === user?._id);
    };

    const userClubs = clubs.filter(club =>
        club.members?.some(member => member.user._id === user?._id)
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
                {/* Header Section */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        University Events
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Discover and register for exciting events happening at your university
                    </Typography>
                </Box>

                {/* Search and Filter Section */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={type}
                                    label="Type"
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    {eventTypes.map((eventType) => (
                                        <MenuItem key={eventType} value={eventType}>
                                            {eventType}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Club</InputLabel>
                                <Select
                                    value={clubFilter}
                                    label="Club"
                                    onChange={(e) => setClubFilter(e.target.value)}
                                >
                                    <MenuItem value="All">All Clubs</MenuItem>
                                    {clubs.map((club) => (
                                        <MenuItem key={club._id} value={club._id}>
                                            {club.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={upcomingOnly}
                                        onChange={(e) => setUpcomingOnly(e.target.checked)}
                                    />
                                }
                                label="Upcoming events only"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={2}>
                            <Typography variant="body2" color="text.secondary">
                                Found {events.length} events
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                {/* Events Grid */}
                {loading ? (
                    <Typography textAlign="center">Loading events...</Typography>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {events.length === 0 ? (
                                <Grid item xs={12}>
                                    <Typography variant="h6" color="text.secondary" textAlign="center">
                                        No events found matching your criteria
                                    </Typography>
                                </Grid>
                            ) : (
                                events.map((event) => (
                                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'transform 0.2s ease-in-out',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 4
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                            mr: 2,
                                                            bgcolor: 'secondary.main'
                                                        }}
                                                    >
                                                        <EventIcon fontSize="large" />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
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

                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {event.description?.length > 100
                                                        ? `${event.description.substring(0, 100)}...`
                                                        : event.description}
                                                </Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(event.startDate)}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {event.venue?.name || 'TBD'}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {event.organizer?.name}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Attendees:</strong> {event.attendees?.length || 0}
                                                        {event.capacity && `/${event.capacity}`}
                                                    </Typography>
                                                    {event.entryFee > 0 && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>Fee:</strong> ${event.entryFee}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </CardContent>

                                            <CardActions sx={{ p: 2, pt: 0 }}>
                                                {event.registrationRequired ? (
                                                    !isUserRegistered(event) ? (
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={() => handleRegisterEvent(event._id)}
                                                            disabled={event.capacity && event.attendees?.length >= event.capacity}
                                                        >
                                                            {event.capacity && event.attendees?.length >= event.capacity
                                                                ? 'Full'
                                                                : 'Register'}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            fullWidth
                                                            variant="outlined"
                                                            color="success"
                                                            disabled
                                                        >
                                                            ✓ Registered
                                                        </Button>
                                                    )
                                                ) : (
                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        color="info"
                                                        disabled
                                                    >
                                                        Open Event
                                                    </Button>
                                                )}
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(e, value) => setPage(value)}
                                    color="primary"
                                    size="large"
                                />
                            </Box>
                        )}
                    </>
                )}

                {/* Floating Action Button for Creating Event */}
                {user && (user.role === 'Club Admin' || user.role === 'Administrator') && userClubs.length > 0 && (
                    <Fab
                        color="secondary"
                        aria-label="create event"
                        sx={{ position: 'fixed', bottom: 16, right: 16 }}
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        <AddIcon />
                    </Fab>
                )}                {/* Create Event Dialog */}
                <Dialog
                    open={createDialogOpen}
                    onClose={() => setCreateDialogOpen(false)}
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
                                            {eventTypes.slice(1).map((eventType) => (
                                                <MenuItem key={eventType} value={eventType}>
                                                    {eventType}
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
                                            {userClubs.map((club) => (
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
                                    <DateTimePicker
                                        label="Start Date & Time"
                                        value={newEvent.startDate}
                                        onChange={(newValue) => setNewEvent({ ...newEvent, startDate: newValue })}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker
                                        label="End Date & Time"
                                        value={newEvent.endDate}
                                        onChange={(newValue) => setNewEvent({ ...newEvent, endDate: newValue })}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Capacity (optional)"
                                        type="number"
                                        value={newEvent.capacity}
                                        onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Entry Fee ($)"
                                        type="number"
                                        value={newEvent.entryFee}
                                        onChange={(e) => setNewEvent({ ...newEvent, entryFee: parseFloat(e.target.value) || 0 })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={newEvent.registrationRequired}
                                                onChange={(e) => setNewEvent({ ...newEvent, registrationRequired: e.target.checked })}
                                            />
                                        }
                                        label="Registration Required"
                                    />
                                </Grid>
                                {newEvent.registrationRequired && (
                                    <Grid item xs={12}>
                                        <DateTimePicker
                                            label="Registration Deadline"
                                            value={newEvent.registrationDeadline}
                                            onChange={(newValue) => setNewEvent({ ...newEvent, registrationDeadline: newValue })}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
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
        </LocalizationProvider>
    );
};

export default Events;
