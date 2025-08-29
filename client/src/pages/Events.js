import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '../features/auth/context/AuthContext';
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';

const Events = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('All');
    const [clubFilter, setClubFilter] = useState('All');
    const [universityFilter, setUniversityFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('all');
    const [accessTypeFilter, setAccessTypeFilter] = useState('all');
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
        accessType: 'open'
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
    }, [page, search, type, clubFilter, universityFilter, statusFilter, accessTypeFilter]);

    // Reset to first page when filters/search change
    useEffect(() => {
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, type, clubFilter, universityFilter, statusFilter, accessTypeFilter]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '9'
            });

            if (search) params.append('search', search);
            if (type && type !== 'All') params.append('type', type);
            if (clubFilter && clubFilter !== 'All') params.append('club', clubFilter);
            if (universityFilter && universityFilter !== 'All') params.append('university', universityFilter);
            if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
            if (accessTypeFilter && accessTypeFilter !== 'all') params.append('accessType', accessTypeFilter);

            const response = await axios.get(`${API_BASE_URL}/events?${params}`);

            setEvents(response.data.events || []);
            setTotalPages(response.data.totalPages || 1);
            setTotalCount(response.data.total || (response.data.events ? response.data.events.length : 0));
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchClubs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/clubs`);
            setClubs(response.data.clubs || []);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            setClubs([]);
        }
    };

    const fetchUniversities = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/universities`);
            setUniversities(response.data.universities || []);
        } catch (error) {
            console.error('Error fetching universities:', error);
            setUniversities([]);
        }
    };

    const handleRegisterEvent = async (event) => {
        // Check access control for university-exclusive events
        if (event.accessType === 'university-exclusive' && 
            event.club?.university?._id !== user?.university?._id) {
            alert('This event is exclusive to students from ' + (event.club?.university?.name || 'the organizing university'));
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/events/${event._id}/register`);
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

            await axios.post(`${API_BASE_URL}/events`, eventData);
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
            accessType: 'open'
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

    // Derive status from dates for accurate labeling
    const getEventStatus = (event) => {
        const now = new Date();
        const start = event?.startDate ? new Date(event.startDate) : null;
        const end = event?.endDate ? new Date(event.endDate) : null;
        if (end && end < now) return 'closed';
        if (start && start <= now && (!end || end >= now)) return 'ongoing';
        return 'upcoming';
    };

    // Determine if registration should be disabled
    const isRegistrationClosedForEvent = (event) => {
        const now = new Date();
        const capacityFull = event.maxAttendees && event.attendees?.length >= event.maxAttendees;
        const uniExclusiveBlocked = event.accessType === 'university-exclusive' && event.club?.university?._id !== user?.university?._id;
        const deadlinePassed = event.registrationDeadline && now > new Date(event.registrationDeadline);
        const eventEnded = event.endDate && now > new Date(event.endDate);
        const startedNoDeadline = !event.registrationDeadline && event.startDate && now >= new Date(event.startDate);
        return capacityFull || uniExclusiveBlocked || deadlinePassed || eventEnded || startedNoDeadline;
    };

    const handleEventClick = (eventId) => {
        navigate(`/events/${eventId}`);
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
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Status"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="upcoming">Upcoming</MenuItem>
                                    <MenuItem value="ongoing">Ongoing</MenuItem>
                                    <MenuItem value="closed">Closed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Access Type</InputLabel>
                                <Select
                                    value={accessTypeFilter}
                                    label="Access Type"
                                    onChange={(e) => setAccessTypeFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Events</MenuItem>
                                    <MenuItem value="open">Open Events</MenuItem>
                                    <MenuItem value="university-exclusive">University Only</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2}>
                            <Typography variant="body2" color="text.secondary">
                                Showing {events.length} of {totalCount} events
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
                                    <Grid item xs={12} sm={6} md={3} lg={2} key={event._id}>
                                        <Card
                                            sx={{
                                                height: 280,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                            onClick={() => handleEventClick(event._id)}
                                        >
                                            {/* Compact Header */}
                                            <Box
                                                sx={{
                                                    background: 'linear-gradient(135deg, #ff7043 0%, #f57c00 100%)',
                                                    p: 1.5,
                                                    position: 'relative',
                                                    height: 90
                                                }}
                                            >
                                                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                    <Chip
                                                        label={event.eventType || event.type || 'Event'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(255,255,255,0.2)',
                                                            color: 'white',
                                                            fontSize: '0.65rem',
                                                            height: 20
                                                        }}
                                                    />
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <Chip
                                                            label={getEventStatus(event)}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: getEventStatus(event) === 'ongoing' ? '#4caf50' : 
                                                                        getEventStatus(event) === 'closed' ? '#f44336' : '#2196f3',
                                                                color: 'white',
                                                                fontSize: '0.6rem',
                                                                height: 18,
                                                                textTransform: 'capitalize'
                                                            }}
                                                        />
                                                        <Chip
                                                            label={event.accessType === 'university-exclusive' ? 'Uni Only' : 'Open'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: event.accessType === 'university-exclusive' ? '#ff9800' : '#9c27b0',
                                                                color: 'white',
                                                                fontSize: '0.6rem',
                                                                height: 18
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            bgcolor: 'rgba(255,255,255,0.95)',
                                                            color: '#ff7043',
                                                        }}
                                                    >
                                                        <EventIcon sx={{ fontSize: 18 }} />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                fontSize: '0.95rem',
                                                                lineHeight: 1.2,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {event.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: 'rgba(255,255,255,0.8)',
                                                                fontSize: '0.7rem'
                                                            }}
                                                        >
                                                            {formatDate(event.startDate)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mb: 2,
                                                        fontSize: '0.8rem',
                                                        lineHeight: 1.3,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        flex: 1
                                                    }}
                                                >
                                                    {event.description?.length > 80
                                                        ? `${event.description.substring(0, 80)}...`
                                                        : event.description || 'Join this exciting event!'}
                                                </Typography>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <LocationOnIcon sx={{ fontSize: 12, color: '#ff6b6b' }} />
                                                            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                                                {typeof event.venue === 'string'
                                                                    ? (event.venue.length > 10 ? `${event.venue.substring(0, 10)}...` : event.venue)
                                                                    : (event.venue?.name?.length > 10 ? `${event.venue.name.substring(0, 10)}...` : event.venue?.name || 'TBD')}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <GroupsIcon sx={{ fontSize: 12, color: '#ff9800' }} />
                                                            <Typography variant="caption" sx={{ color: '#ff9800', fontWeight: 600, fontSize: '0.7rem' }}>
                                                                {event.attendees?.length || 0}
                                                                {event.maxAttendees && `/${event.maxAttendees}`}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <PersonIcon sx={{ fontSize: 12, color: '#4caf50' }} />
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                fontSize: '0.7rem',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                flex: 1
                                                            }}
                                                        >
                                                            {event.organizer?.name?.substring(0, 12) || event.club?.name?.substring(0, 12) || 'Unknown'}
                                                            {((event.organizer?.name?.length > 12) || (event.club?.name?.length > 12)) ? '...' : ''}
                                                        </Typography>
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
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRegisterEvent(event);
                                                            }}
                                                            disabled={isRegistrationClosedForEvent(event)}
                                                            sx={{
                                                                background: isRegistrationClosedForEvent(event)
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
                                                                    background: isRegistrationClosedForEvent(event)
                                                                        ? 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)'
                                                                        : 'linear-gradient(135deg, #ff5252 0%, #ff8f00 100%)',
                                                                    boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)'
                                                                }
                                                            }}
                                                        >
                                                            {(() => {
                                                                const now = new Date();
                                                                const capacityFull = event.maxAttendees && event.attendees?.length >= event.maxAttendees;
                                                                const uniExclusiveBlocked = event.accessType === 'university-exclusive' && event.club?.university?._id !== user?.university?._id;
                                                                const deadlinePassed = event.registrationDeadline && now > new Date(event.registrationDeadline);
                                                                const eventEnded = event.endDate && now > new Date(event.endDate);
                                                                const startedNoDeadline = !event.registrationDeadline && event.startDate && now >= new Date(event.startDate);
                                                                if (capacityFull) return 'Event Full';
                                                                if (uniExclusiveBlocked) return 'University Exclusive';
                                                                if (eventEnded) return 'Event Ended';
                                                                if (deadlinePassed || startedNoDeadline) return 'Registration Closed';
                                                                return 'Register Now';
                                                            })()}
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
                                                                borderColor: '#2196f3',
                                                                color: '#2196f3',
                                                                bgcolor: 'rgba(33, 150, 243, 0.05)',
                                                                '&.Mui-disabled': {
                                                                    borderColor: '#2196f3',
                                                                    color: '#2196f3'
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
                                                        No Registration Required
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
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Access Type</InputLabel>
                                        <Select
                                            value={newEvent.accessType}
                                            label="Access Type"
                                            onChange={(e) => setNewEvent({ ...newEvent, accessType: e.target.value })}
                                        >
                                            <MenuItem value="open">Open Event (All Universities)</MenuItem>
                                            <MenuItem value="university-exclusive">University Exclusive</MenuItem>
                                        </Select>
                                    </FormControl>
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
