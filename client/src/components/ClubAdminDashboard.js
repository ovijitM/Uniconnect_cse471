import React, { useState, useEffect } from 'react';
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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
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
    IconButton,
    Tooltip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import GroupsIcon from '@mui/icons-material/Groups';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

const ClubAdminDashboard = () => {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [clubRequests, setClubRequests] = useState([]);
    const [myClubs, setMyClubs] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Club Request Dialog
    const [clubRequestDialogOpen, setClubRequestDialogOpen] = useState(false);
    const [newClubRequest, setNewClubRequest] = useState({
        name: '',
        description: '',
        category: 'Academic',
        contactEmail: user?.email || '',
        membershipFee: 0
    });

    // Event Creation Dialog
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [selectedClub, setSelectedClub] = useState('');
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        type: 'Workshop',
        startDate: dayjs(),
        endDate: dayjs().add(2, 'hour'),
        venue: '',
        capacity: '',
        registrationRequired: true,
        registrationDeadline: dayjs().add(1, 'day'),
        entryFee: 0,
        requirements: '',
        contactInfo: user?.email || '',
        isPublic: true
    });

    const clubCategories = [
        'Academic', 'Sports', 'Cultural', 'Technical', 'Social',
        'Professional', 'Arts', 'Environment', 'Community Service', 'Other'
    ];

    const eventTypes = [
        'Workshop', 'Seminar', 'Competition', 'Social Event', 'Meeting',
        'Conference', 'Sports', 'Cultural', 'Academic', 'Other'
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchClubRequests(),
                fetchMyClubs(),
                fetchMyEvents()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClubRequests = async () => {
        try {
            const response = await axios.get('/api/club-requests');
            setClubRequests(response.data.requests || []);
        } catch (error) {
            console.error('Error fetching club requests:', error);
        }
    };

    const fetchMyClubs = async () => {
        try {
            const response = await axios.get('/api/clubs');
            // Filter clubs where current user is president
            const myClubsData = response.data.clubs.filter(club =>
                club.president && club.president._id === user._id
            );
            setMyClubs(myClubsData);
        } catch (error) {
            console.error('Error fetching clubs:', error);
        }
    };

    const fetchMyEvents = async () => {
        try {
            const response = await axios.get('/api/events');
            // Filter events for clubs where user is president
            const myClubIds = myClubs.map(club => club._id);
            const myEventsData = response.data.events.filter(event =>
                myClubIds.includes(event.club?._id)
            );
            setMyEvents(myEventsData);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleCreateClubRequest = async () => {
        try {
            await axios.post('/api/club-requests', newClubRequest);
            setClubRequestDialogOpen(false);
            setNewClubRequest({
                name: '',
                description: '',
                category: 'Academic',
                contactEmail: user?.email || '',
                membershipFee: 0
            });
            fetchClubRequests();
            alert('Club request submitted successfully!');
        } catch (error) {
            console.error('Error creating club request:', error);
            alert(error.response?.data?.message || 'Error creating club request');
        }
    };

    const handleDeleteClubRequest = async (requestId) => {
        if (!window.confirm('Are you sure you want to delete this club request?')) return;

        try {
            await axios.delete(`/api/club-requests/${requestId}`);
            fetchClubRequests();
            alert('Club request deleted successfully!');
        } catch (error) {
            console.error('Error deleting club request:', error);
            alert(error.response?.data?.message || 'Error deleting club request');
        }
    };

    const handleCreateEvent = async () => {
        try {
            const eventData = {
                ...newEvent,
                organizer: selectedClub,
                startDate: newEvent.startDate.toISOString(),
                endDate: newEvent.endDate.toISOString(),
                registrationDeadline: newEvent.registrationDeadline.toISOString(),
                capacity: newEvent.capacity ? parseInt(newEvent.capacity) : null
            };

            await axios.post('/api/events', eventData);
            setEventDialogOpen(false);
            setNewEvent({
                title: '',
                description: '',
                type: 'Workshop',
                startDate: dayjs(),
                endDate: dayjs().add(2, 'hour'),
                venue: '',
                capacity: '',
                registrationRequired: true,
                registrationDeadline: dayjs().add(1, 'day'),
                entryFee: 0,
                requirements: '',
                contactInfo: user?.email || '',
                isPublic: true
            });
            setSelectedClub('');
            fetchMyEvents();
            alert('Event created successfully!');
        } catch (error) {
            console.error('Error creating event:', error);
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <PendingIcon />;
            case 'approved': return <CheckCircleIcon />;
            case 'rejected': return <CancelIcon />;
            default: return <PendingIcon />;
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Loading...
                </Typography>
            </Container>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Club Admin Dashboard
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                        <Tab label="Club Requests" icon={<GroupsIcon />} />
                        <Tab label="My Clubs" icon={<GroupsIcon />} />
                        <Tab label="My Events" icon={<EventIcon />} />
                    </Tabs>
                </Box>

                {/* Club Requests Tab */}
                {tabValue === 0 && (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Your Club Requests</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setClubRequestDialogOpen(true)}
                                disabled={clubRequests.some(req => req.status === 'pending')}
                            >
                                Request New Club
                            </Button>
                        </Box>

                        {clubRequests.some(req => req.status === 'pending') && (
                            <Alert severity="info" sx={{ mb: 3 }}>
                                You have a pending club request. You cannot submit a new request until it's reviewed.
                            </Alert>
                        )}

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Club Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Submitted</TableCell>
                                        <TableCell>Admin Notes</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clubRequests.map((request) => (
                                        <TableRow key={request._id}>
                                            <TableCell>{request.name}</TableCell>
                                            <TableCell>{request.category}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={request.status}
                                                    color={getStatusColor(request.status)}
                                                    icon={getStatusIcon(request.status)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{request.adminNotes || 'N/A'}</TableCell>
                                            <TableCell>
                                                {request.status === 'pending' && (
                                                    <Tooltip title="Delete Request">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDeleteClubRequest(request._id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {request.status === 'approved' && request.clubId && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => window.location.href = `/clubs`}
                                                    >
                                                        View Club
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {clubRequests.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                No club requests found. Click "Request New Club" to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* My Clubs Tab */}
                {tabValue === 1 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Clubs You Manage ({myClubs.length})
                        </Typography>

                        <Grid container spacing={3}>
                            {myClubs.map((club) => (
                                <Grid item xs={12} sm={6} md={4} key={club._id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {club.name}
                                            </Typography>
                                            <Chip
                                                label={club.category}
                                                size="small"
                                                color="primary"
                                                sx={{ mb: 2 }}
                                            />
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {club.description}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Members:</strong> {club.members?.length || 0}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Fee:</strong> ${club.membershipFee || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {myClubs.length === 0 && (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                                        <GroupsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No clubs found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            You don't manage any clubs yet. Submit a club request to get started.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}

                {/* My Events Tab */}
                {tabValue === 2 && (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">
                                Events You've Created ({myEvents.length})
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setEventDialogOpen(true)}
                                disabled={myClubs.length === 0}
                            >
                                Create Event
                            </Button>
                        </Box>

                        {myClubs.length === 0 && (
                            <Alert severity="info" sx={{ mb: 3 }}>
                                You need to have an approved club before you can create events.
                            </Alert>
                        )}

                        <Grid container spacing={3}>
                            {myEvents.map((event) => (
                                <Grid item xs={12} sm={6} md={4} key={event._id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {event.title}
                                            </Typography>
                                            <Chip
                                                label={event.eventType}
                                                size="small"
                                                color="secondary"
                                                sx={{ mb: 2 }}
                                            />
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {event.description}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Venue:</strong> {event.venue}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Attendees:</strong> {event.attendees?.length || 0}
                                                {event.maxAttendees && `/${event.maxAttendees}`}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {myEvents.length === 0 && myClubs.length > 0 && (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                                        <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No events found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            You haven't created any events yet. Click "Create Event" to get started.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}

                {/* Club Request Dialog */}
                <Dialog
                    open={clubRequestDialogOpen}
                    onClose={() => setClubRequestDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Request New Club</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <TextField
                                label="Club Name"
                                value={newClubRequest.name}
                                onChange={(e) => setNewClubRequest({ ...newClubRequest, name: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                value={newClubRequest.description}
                                onChange={(e) => setNewClubRequest({ ...newClubRequest, description: e.target.value })}
                                multiline
                                rows={4}
                                required
                                fullWidth
                            />
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={newClubRequest.category}
                                    label="Category"
                                    onChange={(e) => setNewClubRequest({ ...newClubRequest, category: e.target.value })}
                                >
                                    {clubCategories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Contact Email"
                                type="email"
                                value={newClubRequest.contactEmail}
                                onChange={(e) => setNewClubRequest({ ...newClubRequest, contactEmail: e.target.value })}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Membership Fee ($)"
                                type="number"
                                value={newClubRequest.membershipFee}
                                onChange={(e) => setNewClubRequest({ ...newClubRequest, membershipFee: parseFloat(e.target.value) || 0 })}
                                fullWidth
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setClubRequestDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleCreateClubRequest}
                            variant="contained"
                            disabled={!newClubRequest.name || !newClubRequest.description || !newClubRequest.contactEmail}
                        >
                            Submit Request
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Event Creation Dialog */}
                <Dialog
                    open={eventDialogOpen}
                    onClose={() => setEventDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <FormControl fullWidth required>
                                <InputLabel>Select Club</InputLabel>
                                <Select
                                    value={selectedClub}
                                    label="Select Club"
                                    onChange={(e) => setSelectedClub(e.target.value)}
                                >
                                    {myClubs.map((club) => (
                                        <MenuItem key={club._id} value={club._id}>
                                            {club.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Event Title"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Description"
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                multiline
                                rows={3}
                                required
                                fullWidth
                            />

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

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <DateTimePicker
                                    label="Start Date & Time"
                                    value={newEvent.startDate}
                                    onChange={(date) => setNewEvent({ ...newEvent, startDate: date })}
                                    sx={{ flex: 1 }}
                                />
                                <DateTimePicker
                                    label="End Date & Time"
                                    value={newEvent.endDate}
                                    onChange={(date) => setNewEvent({ ...newEvent, endDate: date })}
                                    sx={{ flex: 1 }}
                                />
                            </Box>

                            <TextField
                                label="Venue"
                                value={newEvent.venue}
                                onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                                fullWidth
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Max Attendees"
                                    type="number"
                                    value={newEvent.capacity}
                                    onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                                    sx={{ flex: 1 }}
                                    inputProps={{ min: 1 }}
                                />
                                <TextField
                                    label="Entry Fee ($)"
                                    type="number"
                                    value={newEvent.entryFee}
                                    onChange={(e) => setNewEvent({ ...newEvent, entryFee: parseFloat(e.target.value) || 0 })}
                                    sx={{ flex: 1 }}
                                    inputProps={{ min: 0, step: 0.01 }}
                                />
                            </Box>

                            <DateTimePicker
                                label="Registration Deadline"
                                value={newEvent.registrationDeadline}
                                onChange={(date) => setNewEvent({ ...newEvent, registrationDeadline: date })}
                            />

                            <TextField
                                label="Requirements"
                                value={newEvent.requirements}
                                onChange={(e) => setNewEvent({ ...newEvent, requirements: e.target.value })}
                                multiline
                                rows={2}
                                fullWidth
                            />

                            <FormControl fullWidth>
                                <InputLabel>Event Visibility</InputLabel>
                                <Select
                                    value={newEvent.isPublic}
                                    label="Event Visibility"
                                    onChange={(e) => setNewEvent({ ...newEvent, isPublic: e.target.value })}
                                >
                                    <MenuItem value={true}>Public - Visible to all users</MenuItem>
                                    <MenuItem value={false}>Private - Only visible to your university</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEventDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleCreateEvent}
                            variant="contained"
                            disabled={!selectedClub || !newEvent.title || !newEvent.description}
                        >
                            Create Event
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </LocalizationProvider>
    );
};

export default ClubAdminDashboard;
