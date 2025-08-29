import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import VideoCallIcon from '@mui/icons-material/VideoCall';

const EventsTab = ({
    myEvents,
    onAddEvent,
    onEditEvent,
    onDeleteEvent,
    onManageAttendees
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };



    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">My Events</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddEvent}
                >
                    Create New Event
                </Button>
            </Box>

            <Grid container spacing={3}>
                {myEvents.length === 0 ? (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <EventIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    No events found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Create your first event to get started
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={onAddEvent}
                                >
                                    Create New Event
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (
                    myEvents.map((event) => {
                        const getStatusColor = (status) => {
                            switch(status) {
                                case 'ongoing': return 'success';
                                case 'closed': return 'error';
                                case 'upcoming': return 'primary';
                                default: return 'default';
                            }
                        };
                        
                        return (
                            <Grid item xs={12} md={6} lg={4} key={event._id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box sx={{ flexGrow: 1, mr: 1 }}>
                                                <Typography variant="h6" noWrap>
                                                    {event.title}
                                                </Typography>
                                                {event.club && (
                                                    <Typography variant="body2" color="primary" sx={{ fontWeight: 500, mb: 0.5 }}>
                                                        📍 {event.club.name}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box display="flex" gap={0.5} flexDirection="column">
                                                <Box display="flex" gap={0.5}>
                                                    <Chip 
                                                        label={event.status || 'upcoming'} 
                                                        size="small" 
                                                        color={getStatusColor(event.status)} 
                                                        sx={{ textTransform: 'capitalize' }}
                                                    />
                                                    <Chip 
                                                        label={event.accessType === 'university-exclusive' ? 'Uni Only' : 'Open'} 
                                                        size="small" 
                                                        color={event.accessType === 'university-exclusive' ? 'warning' : 'secondary'} 
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {event.description?.length > 100
                                                ? `${event.description.substring(0, 100)}...`
                                                : event.description}
                                        </Typography>

                                        <Box mb={2}>
                                            <Typography variant="body2" display="flex" alignItems="center" mb={0.5}>
                                                <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
                                                {formatDate(event.date)} at {formatTime(event.time)}
                                            </Typography>

                                            <Typography variant="body2" display="flex" alignItems="center" mb={0.5}>
                                                {event.isVirtual ? (
                                                    <>
                                                        <VideoCallIcon fontSize="small" sx={{ mr: 1 }} />
                                                        Virtual Event
                                                    </>
                                                ) : (
                                                    <>
                                                        <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                                                        {event.location}
                                                    </>
                                                )}
                                            </Typography>

                                            {event.maxAttendees && (
                                                <Typography variant="body2" display="flex" alignItems="center">
                                                    <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
                                                    {event.attendees?.length || 0} / {event.maxAttendees} attendees
                                                </Typography>
                                            )}
                                        </Box>

                                        {event.category && (
                                            <Chip
                                                label={event.category}
                                                size="small"
                                                variant="outlined"
                                                sx={{ mb: 1 }}
                                            />
                                        )}

                                        {event.price && parseFloat(event.price) > 0 && (
                                            <Typography variant="body2" color="primary" fontWeight="bold">
                                                ${event.price}
                                            </Typography>
                                        )}

                                        {event.tags && event.tags.length > 0 && (
                                            <Box mt={1}>
                                                {event.tags.slice(0, 2).map((tag) => (
                                                    <Chip
                                                        key={tag}
                                                        label={tag}
                                                        size="small"
                                                        sx={{ mr: 0.5, mb: 0.5 }}
                                                    />
                                                ))}
                                                {event.tags.length > 2 && (
                                                    <Chip
                                                        label={`+${event.tags.length - 2} more`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                        )}
                                    </CardContent>

                                    <CardActions>
                                        <Tooltip title="Manage Attendees">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    console.log('Manage Attendees button clicked for event:', event);
                                                    onManageAttendees(event);
                                                }}
                                            >
                                                <PeopleIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Event">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    console.log('Edit Event button clicked for event:', event);
                                                    onEditEvent(event);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Event">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    console.log('Delete Event button clicked for event ID:', event._id);
                                                    onDeleteEvent(event._id);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })
                )}
            </Grid>
        </Box>
    );
};

export default EventsTab;
