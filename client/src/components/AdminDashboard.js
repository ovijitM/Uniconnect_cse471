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
    ListItemSecondaryAction,
    Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [clubRequests, setClubRequests] = useState([]);
    const [allClubs, setAllClubs] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // View Request Dialog
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Review Dialog
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewAction, setReviewAction] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    const [stats, setStats] = useState({
        totalClubs: 0,
        totalEvents: 0,
        totalUsers: 0,
        pendingRequests: 0,
        approvedThisMonth: 0,
        rejectedThisMonth: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchClubRequests(),
                fetchAllClubs(),
                fetchAllEvents(),
                fetchAllUsers()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClubRequests = async () => {
        try {
            const response = await axios.get('/api/club-requests/all');
            const requests = response.data.requests || [];
            setClubRequests(requests);

            // Calculate stats
            const pending = requests.filter(r => r.status === 'pending').length;
            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);

            const approvedThisMonth = requests.filter(r =>
                r.status === 'approved' && new Date(r.updatedAt) >= thisMonth
            ).length;

            const rejectedThisMonth = requests.filter(r =>
                r.status === 'rejected' && new Date(r.updatedAt) >= thisMonth
            ).length;

            setStats(prev => ({
                ...prev,
                pendingRequests: pending,
                approvedThisMonth,
                rejectedThisMonth
            }));
        } catch (error) {
            console.error('Error fetching club requests:', error);
        }
    };

    const fetchAllClubs = async () => {
        try {
            const response = await axios.get('/api/clubs');
            const clubs = response.data.clubs || [];
            setAllClubs(clubs);
            setStats(prev => ({ ...prev, totalClubs: clubs.length }));
        } catch (error) {
            console.error('Error fetching clubs:', error);
        }
    };

    const fetchAllEvents = async () => {
        try {
            const response = await axios.get('/api/events');
            const events = response.data.events || [];
            setAllEvents(events);
            setStats(prev => ({ ...prev, totalEvents: events.length }));
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            const users = response.data.users || [];
            setAllUsers(users);
            setStats(prev => ({ ...prev, totalUsers: users.length }));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleViewRequest = (request) => {
        setSelectedRequest(request);
        setViewDialogOpen(true);
    };

    const handleReviewRequest = (request, action) => {
        setSelectedRequest(request);
        setReviewAction(action);
        setAdminNotes('');
        setReviewDialogOpen(true);
    };

    const handleSubmitReview = async () => {
        try {
            await axios.put(`/api/club-requests/${selectedRequest._id}`, {
                status: reviewAction,
                adminNotes: adminNotes
            });

            setReviewDialogOpen(false);
            setSelectedRequest(null);
            setReviewAction('');
            setAdminNotes('');

            fetchClubRequests();
            if (reviewAction === 'approved') {
                fetchAllClubs(); // Refresh clubs list
            }

            alert(`Club request ${reviewAction} successfully!`);
        } catch (error) {
            console.error('Error reviewing club request:', error);
            alert(error.response?.data?.message || 'Error processing request');
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

    if (user?.role !== 'Administrator') {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">
                    Access denied. This page is only available to administrators.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Administrator Dashboard
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <GroupsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {stats.totalClubs}
                            </Typography>
                            <Typography color="text.secondary">
                                Total Clubs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <EventIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {stats.totalEvents}
                            </Typography>
                            <Typography color="text.secondary">
                                Total Events
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <PersonIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {stats.totalUsers}
                            </Typography>
                            <Typography color="text.secondary">
                                Total Users
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <PendingIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="warning.main">
                                {stats.pendingRequests}
                            </Typography>
                            <Typography color="text.secondary">
                                Pending Requests
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab
                        label={`Club Requests (${stats.pendingRequests})`}
                        icon={<PendingIcon />}
                    />
                    <Tab label="All Clubs" icon={<GroupsIcon />} />
                    <Tab label="All Events" icon={<EventIcon />} />
                    <Tab label="Users" icon={<PersonIcon />} />
                </Tabs>
            </Box>

            {/* Club Requests Tab */}
            {tabValue === 0 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Club Creation Requests
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Club Name</TableCell>
                                    <TableCell>Requested By</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date Submitted</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clubRequests.map((request) => (
                                    <TableRow key={request._id}>
                                        <TableCell>{request.name}</TableCell>
                                        <TableCell>{request.requestedBy?.name || 'Unknown'}</TableCell>
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
                                        <TableCell>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    onClick={() => handleViewRequest(request)}
                                                    size="small"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {request.status === 'pending' && (
                                                <>
                                                    <Tooltip title="Approve">
                                                        <IconButton
                                                            color="success"
                                                            onClick={() => handleReviewRequest(request, 'approved')}
                                                            size="small"
                                                        >
                                                            <ThumbUpIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reject">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleReviewRequest(request, 'rejected')}
                                                            size="small"
                                                        >
                                                            <ThumbDownIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {clubRequests.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No club requests found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* All Clubs Tab */}
            {tabValue === 1 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        All Clubs ({stats.totalClubs})
                    </Typography>

                    <Grid container spacing={3}>
                        {allClubs.map((club) => (
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
                                            {club.description?.length > 100
                                                ? `${club.description.substring(0, 100)}...`
                                                : club.description}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>President:</strong> {club.president?.name || 'Not set'}
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
                    </Grid>
                </Box>
            )}

            {/* All Events Tab */}
            {tabValue === 2 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        All Events ({stats.totalEvents})
                    </Typography>

                    <Grid container spacing={3}>
                        {allEvents.map((event) => (
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
                                            {event.description?.length > 80
                                                ? `${event.description.substring(0, 80)}...`
                                                : event.description}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Organizer:</strong> {event.organizer?.name || event.club?.name || 'Unknown'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Attendees:</strong> {event.attendees?.length || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Users Tab */}
            {tabValue === 3 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        All Users ({stats.totalUsers})
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>University</TableCell>
                                    <TableCell>Joined</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                color={user.role === 'Administrator' ? 'error' :
                                                    user.role === 'Club Admin' ? 'warning' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>{user.university?.name || 'Not set'}</TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* View Request Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Club Request Details</DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ mt: 2 }}>
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Club Name"
                                        secondary={selectedRequest.name}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Description"
                                        secondary={selectedRequest.description}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Category"
                                        secondary={selectedRequest.category}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Requested By"
                                        secondary={selectedRequest.requestedBy?.name || 'Unknown'}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Contact Email"
                                        secondary={selectedRequest.contactEmail}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Membership Fee"
                                        secondary={`$${selectedRequest.membershipFee || 0}`}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Status"
                                        secondary={
                                            <Chip
                                                label={selectedRequest.status}
                                                color={getStatusColor(selectedRequest.status)}
                                                icon={getStatusIcon(selectedRequest.status)}
                                            />
                                        }
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Date Submitted"
                                        secondary={new Date(selectedRequest.createdAt).toLocaleString()}
                                    />
                                </ListItem>
                                {selectedRequest.adminNotes && (
                                    <>
                                        <Divider />
                                        <ListItem>
                                            <ListItemText
                                                primary="Admin Notes"
                                                secondary={selectedRequest.adminNotes}
                                            />
                                        </ListItem>
                                    </>
                                )}
                            </List>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Review Request Dialog */}
            <Dialog
                open={reviewDialogOpen}
                onClose={() => setReviewDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {reviewAction === 'approved' ? 'Approve Club Request' : 'Reject Club Request'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {selectedRequest && (
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                You are about to <strong>{reviewAction}</strong> the club request for{' '}
                                <strong>"{selectedRequest.name}"</strong> by{' '}
                                <strong>{selectedRequest.requestedBy?.name}</strong>.
                            </Typography>
                        )}

                        <TextField
                            label="Admin Notes (Optional)"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                            placeholder={
                                reviewAction === 'approved'
                                    ? 'Add any notes about the approval...'
                                    : 'Please provide a reason for rejection...'
                            }
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmitReview}
                        variant="contained"
                        color={reviewAction === 'approved' ? 'success' : 'error'}
                    >
                        {reviewAction === 'approved' ? 'Approve' : 'Reject'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;
