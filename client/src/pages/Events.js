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
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';

const Events = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('All');
    const [clubFilter, setClubFilter] = useState('All');
    const [universityFilter, setUniversityFilter] = useState('All');
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
        contactInfo: '',
        isPublic: true
    });

    const eventTypes = [
        'All', 'Workshop', 'Seminar', 'Competition', 'Social Event', 'Meeting',
        'Conference', 'Sports', 'Cultural', 'Academic', 'Other'
    ];

    useEffect(() => {
        fetchEvents();
        fetchClubs();
        fetchUniversities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, type, clubFilter, universityFilter, upcomingOnly]);

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
            if (universityFilter && universityFilter !== 'All') params.append('university', universityFilter);

            // Don't filter by university - let server handle public/private logic

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

    const fetchUniversities = async () => {
        try {
            const response = await axios.get('/api/universities');
            setUniversities(response.data.universities || []);
        } catch (error) {
            console.error('Error fetching universities:', error);
            setUniversities([]);
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
            contactInfo: '',
            isPublic: true
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
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>University</InputLabel>
                                <Select
                                    value={universityFilter}
                                    label="University"
                                    onChange={(e) => setUniversityFilter(e.target.value)}
                                >
                                    <MenuItem value="All">All Universities</MenuItem>
                                    {universities.map((university) => (
                                        <MenuItem key={university._id} value={university._id}>
                                            {university.name}
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
                                                position: 'relative',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                cursor: 'pointer',
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                '&:hover': {
                                                    transform: 'translateY(-8px) scale(1.02)',
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                                    '& .event-avatar': {
                                                        transform: 'scale(1.1)',
                                                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                                    },
                                                    '& .event-register-btn': {
                                                        transform: 'scale(1.05)'
                                                    }
                                                }
                                            }}
                                        >
                                            {/* Header Section with Gradient Background */}
                                            <Box
                                                sx={{
                                                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
                                                    p: 3,
                                                    pb: 4,
                                                    position: 'relative'
                                                }}
                                            >
                                                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    <Chip
                                                        label={event.eventType || event.type || 'Event'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(255,255,255,0.2)',
                                                            color: 'white',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            backdropFilter: 'blur(10px)'
                                                        }}
                                                    />
                                                    <Chip
                                                        label={event.isPublic ? 'Public' : 'Private'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: event.isPublic ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 193, 7, 0.3)',
                                                            color: 'white',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            backdropFilter: 'blur(10px)'
                                                        }}
                                                    />
                                                </Box>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                                    <Avatar
                                                        className="event-avatar"
                                                        sx={{
                                                            width: 80,
                                                            height: 80,
                                                            mb: 2,
                                                            bgcolor: 'rgba(255,255,255,0.95)',
                                                            color: '#ff6b6b',
                                                            transition: 'all 0.3s ease',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                                        }}
                                                    >
                                                        <EventIcon sx={{ fontSize: 40 }} />
                                                    </Avatar>

                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: 'white',
                                                            fontWeight: 700,
                                                            fontSize: '1.1rem',
                                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            lineHeight: 1.3,
                                                            textAlign: 'center',
                                                            maxWidth: '100%'
                                                        }}
                                                    >
                                                        {event.title}
                                                    </Typography>

                                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarTodayIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }} />
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: 'rgba(255,255,255,0.9)',
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {formatDate(event.startDate)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        mb: 3,
                                                        lineHeight: 1.6,
                                                        minHeight: '48px',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {event.description?.length > 100
                                                        ? `${event.description.substring(0, 100)}...`
                                                        : event.description || 'Join this exciting event!'}
                                                </Typography>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 2,
                                                                bgcolor: 'rgba(255, 107, 107, 0.1)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                mr: 2
                                                            }}
                                                        >
                                                            <LocationOnIcon sx={{ fontSize: 18, color: '#ff6b6b' }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                                                                Venue
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {typeof event.venue === 'string' ? event.venue : (event.venue?.name || 'TBD')}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 2,
                                                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                mr: 2
                                                            }}
                                                        >
                                                            <PersonIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                                                                Organizer
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {event.organizer?.name || event.club?.name || 'Unknown'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 2,
                                                                bgcolor: 'rgba(63, 81, 181, 0.1)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                mr: 2
                                                            }}
                                                        >
                                                            <SchoolIcon sx={{ fontSize: 18, color: '#3f51b5' }} />
                                                        </Box>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                                                                University
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                {event.university?.name || 'Unknown University'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <GroupsIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800' }}>
                                                                {event.attendees?.length || 0}
                                                                {event.maxAttendees && `/${event.maxAttendees}`}
                                                            </Typography>
                                                        </Box>
                                                        {event.registrationFee > 0 && (
                                                            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                                                ${event.registrationFee}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </CardContent>

                                            <CardActions sx={{ p: 3, pt: 0 }}>
                                                {event.isRegistrationRequired ? (
                                                    !isUserRegistered(event) ? (
                                                        <Button
                                                            className="event-register-btn"
                                                            fullWidth
                                                            variant="contained"
                                                            size="large"
                                                            onClick={() => handleRegisterEvent(event._id)}
                                                            disabled={event.maxAttendees && event.attendees?.length >= event.maxAttendees}
                                                            sx={{
                                                                background: event.maxAttendees && event.attendees?.length >= event.maxAttendees
                                                                    ? 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)'
                                                                    : 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
                                                                borderRadius: 2,
                                                                py: 1.5,
                                                                fontWeight: 600,
                                                                fontSize: '0.95rem',
                                                                textTransform: 'none',
                                                                transition: 'all 0.3s ease',
                                                                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                                                                '&:hover': {
                                                                    background: event.maxAttendees && event.attendees?.length >= event.maxAttendees
                                                                        ? 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)'
                                                                        : 'linear-gradient(135deg, #ff5252 0%, #ff8f00 100%)',
                                                                    boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)'
                                                                }
                                                            }}
                                                        >
                                                            {event.maxAttendees && event.attendees?.length >= event.maxAttendees
                                                                ? 'Event Full'
                                                                : 'Register Now'}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            fullWidth
                                                            variant="outlined"
                                                            size="large"
                                                            disabled
                                                            sx={{
                                                                borderRadius: 2,
                                                                py: 1.5,
                                                                fontWeight: 600,
                                                                fontSize: '0.95rem',
                                                                textTransform: 'none',
                                                                borderColor: '#4caf50',
                                                                color: '#4caf50',
                                                                bgcolor: 'rgba(76, 175, 80, 0.05)',
                                                                '&.Mui-disabled': {
                                                                    borderColor: '#4caf50',
                                                                    color: '#4caf50'
                                                                }
                                                            }}
                                                        >
                                                            ✓ Registered
                                                        </Button>
                                                    )
                                                ) : (
                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        size="large"
                                                        disabled
                                                        sx={{
                                                            borderRadius: 2,
                                                            py: 1.5,
                                                            fontWeight: 600,
                                                            fontSize: '0.95rem',
                                                            textTransform: 'none',
                                                            borderColor: '#2196f3',
                                                            color: '#2196f3',
                                                            bgcolor: 'rgba(33, 150, 243, 0.05)',
                                                            '&.Mui-disabled': {
                                                                borderColor: '#2196f3',
                                                                color: '#2196f3'
                                                            }
                                                        }}
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
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={newEvent.isPublic !== false}
                                                onChange={(e) => setNewEvent({ ...newEvent, isPublic: e.target.checked })}
                                            />
                                        }
                                        label="Public Event (allow students from all universities)"
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
