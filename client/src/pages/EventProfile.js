import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Avatar,
    Button,
    Grid,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Tab,
    Tabs,
    CircularProgress,
    Alert,
    Link
} from '@mui/material';
import { useAuth } from '../features/auth/context/AuthContext';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TeamRecruitmentSection from '../features/team-recruitment/TeamRecruitmentSection';

const EventProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [registerLoading, setRegisterLoading] = useState(false);

    const fetchEventData = useCallback(async () => {
        try {
            const response = await axios.get(`/api/events/${id}`);
            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching event data:', error);
            setError(error.response?.data?.message || 'Failed to load event information');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEventData();
    }, [fetchEventData]);

    const isUserRegistered = () => {
        return event?.attendees?.some(attendee =>
            (typeof attendee === 'object' ? attendee.user._id : attendee) === user?._id
        );
    };

    const isEventFull = () => {
        return event?.maxAttendees && event.attendees?.length >= event.maxAttendees;
    };

    const isRegistrationDeadlinePassed = () => {
        return event?.registrationDeadline && new Date() > new Date(event.registrationDeadline);
    };

    const isEventPast = () => {
        return new Date() > new Date(event?.startDate);
    };

    const handleRegisterUnregister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!event.isRegistrationRequired) {
            alert('Registration is not required for this event');
            return;
        }

        setRegisterLoading(true);
        try {
            if (isUserRegistered()) {
                await axios.post(`/api/events/${id}/unregister`);
            } else {
                await axios.post(`/api/events/${id}/register`);
            }
            await fetchEventData(); // Refresh event data
        } catch (error) {
            console.error('Error registering/unregistering for event:', error);
            alert(error.response?.data?.message || 'Operation failed');
        } finally {
            setRegisterLoading(false);
        }
    };

    const handleClubClick = () => {
        if (event.club?._id) {
            navigate(`/clubs/${event.club._id}`);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };



    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventStatus = () => {
        const now = new Date();
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        if (now < startDate) return { label: 'Upcoming', color: 'primary' };
        if (now >= startDate && now <= endDate) return { label: 'Ongoing', color: 'success' };
        return { label: 'Completed', color: 'default' };
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, mt: 8, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !event) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
                <Alert severity="error">
                    {error || 'Event not found'}
                </Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/events')}
                    sx={{ mt: 2 }}
                >
                    Back to Events
                </Button>
            </Container>
        );
    }

    const eventStatus = getEventStatus();

    return (
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/events')}
                    sx={{ mb: 2 }}
                >
                    Back to Events
                </Button>

                <Paper sx={{ p: 4, mb: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: 'secondary.main',
                                    fontSize: '2.5rem'
                                }}
                                src={event.poster}
                            >
                                <EventIcon sx={{ fontSize: '3rem' }} />
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h3" gutterBottom>
                                {event.title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                <Chip
                                    label={eventStatus.label}
                                    color={eventStatus.color}
                                />
                                <Chip
                                    label={event.eventType}
                                    color="secondary"
                                    variant="outlined"
                                />
                                <Chip
                                    icon={<SchoolIcon />}
                                    label={event.university?.name}
                                    color="primary"
                                />
                                <Chip
                                    icon={<GroupsIcon />}
                                    label={`${event.attendees?.length || 0}${event.maxAttendees ? `/${event.maxAttendees}` : ''} Attendees`}
                                    variant="outlined"
                                />
                                {event.registrationFee > 0 && (
                                    <Chip
                                        icon={<AttachMoneyIcon />}
                                        label={`$${event.registrationFee}`}
                                        color="warning"
                                    />
                                )}
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarTodayIcon color="primary" />
                                        <Typography variant="body1">
                                            {formatDate(event.startDate)}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon color="primary" />
                                        <Typography variant="body1">
                                            {event.startTime} - {event.endTime}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOnIcon color="secondary" />
                                        <Typography variant="body1">
                                            {typeof event.venue === 'string' ? event.venue : event.venue?.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            cursor: event.club?._id ? 'pointer' : 'default'
                                        }}
                                        onClick={event.club?._id ? handleClubClick : undefined}
                                    >
                                        <GroupsIcon color="success" />
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                textDecoration: event.club?._id ? 'underline' : 'none',
                                                '&:hover': event.club?._id ? { color: 'primary.main' } : {}
                                            }}
                                        >
                                            {event.club?.name || event.organizer?.name || 'Unknown Organizer'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Typography variant="body1" color="text.secondary">
                                {event.description}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <CardActions sx={{ flexDirection: 'column', gap: 1 }}>
                                {user && event.isRegistrationRequired && !isEventPast() && (
                                    <Button
                                        variant={isUserRegistered() ? "outlined" : "contained"}
                                        size="large"
                                        startIcon={
                                            isUserRegistered() ? <CancelIcon /> :
                                                isEventFull() ? <CancelIcon /> :
                                                    <CheckCircleIcon />
                                        }
                                        onClick={handleRegisterUnregister}
                                        disabled={
                                            registerLoading ||
                                            (isEventFull() && !isUserRegistered()) ||
                                            isRegistrationDeadlinePassed()
                                        }
                                        sx={{
                                            minWidth: 160,
                                            background: !isUserRegistered() && !isEventFull() ?
                                                'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)' : undefined
                                        }}
                                    >
                                        {registerLoading ? (
                                            <CircularProgress size={20} />
                                        ) : isEventFull() && !isUserRegistered() ? (
                                            'Event Full'
                                        ) : isRegistrationDeadlinePassed() && !isUserRegistered() ? (
                                            'Registration Closed'
                                        ) : isUserRegistered() ? (
                                            'Unregister'
                                        ) : (
                                            'Register'
                                        )}
                                    </Button>
                                )}

                                {!event.isRegistrationRequired && (
                                    <Chip
                                        label="No Registration Required"
                                        color="success"
                                        variant="filled"
                                        size="medium"
                                    />
                                )}

                                {isEventPast() && (
                                    <Chip
                                        label="Event Completed"
                                        color="default"
                                        variant="filled"
                                        size="medium"
                                    />
                                )}
                            </CardActions>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Details" />
                    <Tab label="Attendees" />
                    <Tab label="Organizer" />
                    <Tab label="Contact" />
                    <Tab label="Team Recruitment" />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            {tabValue === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Event Description
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {event.description}
                                </Typography>

                                {event.requirements && (
                                    <>
                                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                            Requirements
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            {event.requirements}
                                        </Typography>
                                    </>
                                )}

                                {event.tags && event.tags.length > 0 && (
                                    <>
                                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                            Tags
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {event.tags.map((tag, index) => (
                                                <Chip key={index} label={tag} size="small" />
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Event Information
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemText
                                            primary="Event Type"
                                            secondary={event.eventType}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Start Date & Time"
                                            secondary={formatDateTime(event.startDate)}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="End Date & Time"
                                            secondary={formatDateTime(event.endDate)}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Venue"
                                            secondary={typeof event.venue === 'string' ? event.venue : event.venue?.name}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Capacity"
                                            secondary={event.maxAttendees || 'Unlimited'}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Registration Fee"
                                            secondary={event.registrationFee > 0 ? `$${event.registrationFee}` : 'Free'}
                                        />
                                    </ListItem>
                                    {event.registrationDeadline && (
                                        <ListItem>
                                            <ListItemText
                                                primary="Registration Deadline"
                                                secondary={formatDateTime(event.registrationDeadline)}
                                            />
                                        </ListItem>
                                    )}
                                    <ListItem>
                                        <ListItemText
                                            primary="Public Event"
                                            secondary={event.isPublic ? 'Yes' : 'No'}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {tabValue === 1 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Attendees ({event.attendees?.length || 0})
                        </Typography>
                        {(!event.attendees || event.attendees.length === 0) ? (
                            <Typography variant="body2" color="text.secondary">
                                No attendees registered yet.
                            </Typography>
                        ) : (
                            <List>
                                {event.attendees.map((attendee, index) => {
                                    const user = typeof attendee === 'object' ? attendee.user : attendee;
                                    return (
                                        <React.Fragment key={user._id || user}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={user.profilePicture}
                                                        sx={{ bgcolor: 'primary.main' }}
                                                    >
                                                        {typeof user === 'object' ?
                                                            user.name?.charAt(0).toUpperCase() :
                                                            '?'
                                                        }
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={typeof user === 'object' ? user.name : 'Anonymous'}
                                                    secondary={
                                                        typeof user === 'object' ? (
                                                            <Box>
                                                                <Typography variant="body2" component="span">
                                                                    {user.email}
                                                                </Typography>
                                                                {user.major && (
                                                                    <Typography variant="body2" component="div">
                                                                        {user.major} • {user.year}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        ) : 'User details not available'
                                                    }
                                                />
                                                {typeof attendee === 'object' && attendee.registeredAt && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Registered: {formatDate(attendee.registeredAt)}
                                                    </Typography>
                                                )}
                                            </ListItem>
                                            {index < event.attendees.length - 1 && <Divider />}
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        )}
                    </CardContent>
                </Card>
            )}

            {tabValue === 2 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Organizing Club
                        </Typography>
                        {event.club ? (
                            <Box>
                                <ListItem sx={{ pl: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={event.club.logo}
                                            sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}
                                        >
                                            {event.club.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Link
                                                component="button"
                                                variant="h6"
                                                onClick={handleClubClick}
                                                sx={{ textDecoration: 'none' }}
                                            >
                                                {event.club.name}
                                            </Link>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" component="div">
                                                    Category: {event.club.category}
                                                </Typography>
                                                <Typography variant="body2" component="div">
                                                    University: {event.club.university?.name || event.university?.name}
                                                </Typography>
                                                {event.club.description && (
                                                    <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                                        {event.club.description.length > 200
                                                            ? `${event.club.description.substring(0, 200)}...`
                                                            : event.club.description
                                                        }
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                <Button
                                    variant="outlined"
                                    onClick={handleClubClick}
                                    sx={{ mt: 2 }}
                                >
                                    Visit Club Profile
                                </Button>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Organizer information not available.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            )}

            {tabValue === 3 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Contact Information
                        </Typography>
                        <List>
                            {event.contactPerson && (
                                <>
                                    {event.contactPerson.name && (
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Contact Person"
                                                secondary={event.contactPerson.name}
                                            />
                                        </ListItem>
                                    )}

                                    {event.contactPerson.email && (
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                    <EmailIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Email"
                                                secondary={event.contactPerson.email}
                                            />
                                        </ListItem>
                                    )}

                                    {event.contactPerson.phone && (
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                                    <PhoneIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Phone"
                                                secondary={event.contactPerson.phone}
                                            />
                                        </ListItem>
                                    )}
                                </>
                            )}

                            {event.contactInfo && (
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'info.main' }}>
                                            <InfoIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Additional Contact Info"
                                        secondary={event.contactInfo}
                                    />
                                </ListItem>
                            )}

                            {/* Fallback to club contact if no specific contact info */}
                            {!event.contactPerson && !event.contactInfo && event.club && (
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            <EmailIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Club Contact"
                                        secondary={event.club.contactEmail || 'Contact through club profile'}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </CardContent>
                </Card>
            )}

            {/* Team Recruitment Tab */}
            {tabValue === 4 && (
                <TeamRecruitmentSection eventId={event._id} />
            )}
        </Container>
    );
};

export default EventProfile;
