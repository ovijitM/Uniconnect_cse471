import React, { useState, useEffect, useCallback } from 'react';
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
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../auth/context/AuthContext';
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

// Administrator Dashboard Component for System Administrators
const AdminDashboard = () => {
    // eslint-disable-next-line no-unused-vars
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);

    // Data states
    const [clubRequests, setClubRequests] = useState([]);
    const [allClubs, setAllClubs] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dialog states for club requests
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewAction, setReviewAction] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    // Dialog states for user management
    const [userDetailDialogOpen, setUserDetailDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
    const [newUserRole, setNewUserRole] = useState('');

    // Dialog states for university management
    const [universityDialogOpen, setUniversityDialogOpen] = useState(false);
    const [editingUniversity, setEditingUniversity] = useState(null);
    const [universityFormData, setUniversityFormData] = useState({
        name: '',
        code: '',
        location: '',
        description: '',
        website: '',
        contactEmail: ''
    });

    // Advanced stats
    const [stats, setStats] = useState({
        totalClubs: 0,
        totalEvents: 0,
        totalUsers: 0,
        totalUniversities: 0,
        pendingRequests: 0,
        approvedThisMonth: 0,
        rejectedThisMonth: 0,
        activeUsersToday: 0,
        upcomingEvents: 0,
        recentJoins: 0,
        systemHealth: 'good'
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchClubRequests(),
                fetchAllClubs(),
                fetchAllEvents(),
                fetchAllUsers(),
                fetchUniversities()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

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

            // Calculate upcoming events
            const upcomingEvents = events.filter(event =>
                new Date(event.startDate) > new Date()
            ).length;

            setStats(prev => ({
                ...prev,
                totalEvents: events.length,
                upcomingEvents
            }));
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            const users = response.data.users || [];
            setAllUsers(users);

            // Calculate user stats
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const activeUsersToday = users.filter(user =>
                user.lastLogin && new Date(user.lastLogin) >= today
            ).length;

            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);

            const recentJoins = users.filter(user =>
                new Date(user.createdAt) >= thisMonth
            ).length;

            setStats(prev => ({
                ...prev,
                totalUsers: users.length,
                activeUsersToday,
                recentJoins
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchUniversities = async () => {
        try {
            const response = await axios.get('/api/universities');
            const universitiesData = response.data.universities || [];
            setUniversities(universitiesData);
            setStats(prev => ({
                ...prev,
                totalUniversities: universitiesData.length
            }));
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Club request handlers
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
            await axios.put(`/api/club-requests/${selectedRequest._id}/review`, {
                status: reviewAction,
                adminNotes: adminNotes
            });

            setReviewDialogOpen(false);
            setSelectedRequest(null);
            setReviewAction('');
            setAdminNotes('');

            fetchClubRequests();
            if (reviewAction === 'approved') {
                fetchAllClubs();
            }

            alert(`Club request ${reviewAction} successfully!`);
        } catch (error) {
            console.error('Error reviewing club request:', error);
            alert(error.response?.data?.message || 'Error processing request');
        }
    };

    // User Management Functions
    const handleViewUser = (user) => {
        setSelectedUser(user);
        setUserDetailDialogOpen(true);
    };

    const handleChangeUserRole = (user) => {
        setSelectedUser(user);
        setNewUserRole(user.role);
        setRoleChangeDialogOpen(true);
    };

    const handleSubmitRoleChange = async () => {
        try {
            await axios.put(`/api/users/${selectedUser._id}/role`, {
                role: newUserRole
            });
            setRoleChangeDialogOpen(false);
            fetchAllUsers();
            alert(`User role updated to ${newUserRole} successfully!`);
        } catch (error) {
            console.error('Error updating user role:', error);
            alert(error.response?.data?.message || 'Error updating user role');
        }
    };

    const handleToggleUserStatus = async (userId, isActive) => {
        try {
            await axios.put(`/api/users/${userId}/status`, {
                isActive: !isActive
            });
            fetchAllUsers();
            alert(`User ${!isActive ? 'activated' : 'deactivated'} successfully!`);
        } catch (error) {
            console.error('Error updating user status:', error);
            alert(error.response?.data?.message || 'Error updating user status');
        }
    };

    // Club Management Functions
    const handleViewClub = (club) => {
        // For now, just log the club data
        console.log('Viewing club:', club);
        alert(`Viewing club: ${club.name}`);
    };

    const handleEditClub = (club) => {
        // For now, just log the club data
        console.log('Editing club:', club);
        alert(`Editing club: ${club.name}`);
    };

    const handleDeleteClub = async (club) => {
        if (window.confirm(`Are you sure you want to delete the club "${club.name}"? This action cannot be undone.`)) {
            try {
                await axios.delete(`/api/clubs/${club._id}`);
                fetchAllClubs();
                alert(`Club "${club.name}" deleted successfully!`);
            } catch (error) {
                console.error('Error deleting club:', error);
                alert(error.response?.data?.message || 'Error deleting club');
            }
        }
    };

    // University Management Functions
    const handleAddUniversity = () => {
        setEditingUniversity(null);
        setUniversityFormData({
            name: '',
            code: '',
            location: '',
            description: '',
            website: '',
            contactEmail: ''
        });
        setUniversityDialogOpen(true);
    };

    const handleEditUniversity = (university) => {
        setEditingUniversity(university);
        setUniversityFormData({
            name: university.name || '',
            code: university.code || '',
            location: university.location || '',
            description: university.description || '',
            website: university.website || '',
            contactEmail: university.contactEmail || ''
        });
        setUniversityDialogOpen(true);
    };

    const handleSubmitUniversity = async () => {
        try {
            if (editingUniversity) {
                await axios.put(`/api/universities/${editingUniversity._id}`, universityFormData);
                alert('University updated successfully!');
            } else {
                await axios.post('/api/universities', universityFormData);
                alert('University created successfully!');
            }
            setUniversityDialogOpen(false);
            fetchUniversities();
        } catch (error) {
            console.error('Error saving university:', error);
            alert(error.response?.data?.message || 'Error saving university');
        }
    };

    const handleDeleteUniversity = async (universityId) => {
        if (!window.confirm('Are you sure? This will affect all associated users and clubs.')) {
            return;
        }

        try {
            await axios.delete(`/api/universities/${universityId}`);
            fetchUniversities();
            alert('University deleted successfully!');
        } catch (error) {
            console.error('Error deleting university:', error);
            alert(error.response?.data?.message || 'Error deleting university');
        }
    };

    // Bulk Operations
    const handleBulkApproveClubs = async () => {
        const pendingRequests = clubRequests.filter(r => r.status === 'pending');
        if (pendingRequests.length === 0) {
            alert('No pending requests to approve');
            return;
        }

        if (!window.confirm(`Approve ${pendingRequests.length} pending club requests?`)) {
            return;
        }

        try {
            await Promise.all(
                pendingRequests.map(request =>
                    axios.put(`/api/club-requests/${request._id}/review`, {
                        status: 'approved',
                        adminNotes: 'Bulk approved by administrator'
                    })
                )
            );
            fetchClubRequests();
            fetchAllClubs();
            alert(`${pendingRequests.length} club requests approved successfully!`);
        } catch (error) {
            console.error('Error bulk approving:', error);
            alert('Error in bulk approval operation');
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

    const getRoleColor = (role) => {
        switch (role) {
            case 'Administrator': return 'error';
            case 'Club Admin': return 'warning';
            case 'Student': return 'primary';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h4" sx={{ ml: 2 }}>
                    Loading Administrator Dashboard...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                🛡️ Administrator Dashboard
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Comprehensive platform management and administration tools
            </Typography>

            {/* Enhanced Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <GroupsIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {stats.totalClubs}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Active Clubs
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                +{stats.approvedThisMonth} this month
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: '#8B4513' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <EventIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {stats.totalEvents}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Total Events
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                {stats.upcomingEvents} upcoming
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#2E8B57' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {stats.totalUsers}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Registered Users
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                {stats.activeUsersToday} active today
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: '#8B008B' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {stats.totalUniversities}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Universities
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                Platform coverage
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pending Requests Alert */}
                {stats.pendingRequests > 0 && (
                    <Grid item xs={12}>
                        <Alert
                            severity="warning"
                            sx={{
                                '& .MuiAlert-icon': { fontSize: '2rem' },
                                '& .MuiAlert-message': { fontSize: '1.1rem' }
                            }}
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={() => setTabValue(0)}
                                    startIcon={<PendingIcon />}
                                >
                                    Review Now
                                </Button>
                            }
                        >
                            <strong>{stats.pendingRequests}</strong> club requests are awaiting your approval
                        </Alert>
                    </Grid>
                )}

                {/* System Health Overview */}
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title="System Health Overview"
                            avatar={
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <TrendingUpIcon />
                                </Avatar>
                            }
                            action={
                                <Button
                                    size="small"
                                    startIcon={<RefreshIcon />}
                                    onClick={fetchData}
                                    variant="outlined"
                                >
                                    Refresh
                                </Button>
                            }
                        />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Box textAlign="center">
                                        <Typography variant="h6" color="primary">
                                            {stats.recentJoins}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            New Users (30d)
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box textAlign="center">
                                        <Typography variant="h6" color="secondary">
                                            {stats.approvedThisMonth}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Clubs Approved
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box textAlign="center">
                                        <Typography variant="h6" color="success.main">
                                            {stats.upcomingEvents}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Upcoming Events
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box textAlign="center">
                                        <Typography variant="h6" color="info.main">
                                            {stats.activeUsersToday}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Active Today
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Enhanced Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab
                        label={`Club Requests ${stats.pendingRequests > 0 ? `(${stats.pendingRequests})` : ''}`}
                        icon={<PendingIcon />}
                        sx={{ minWidth: 120 }}
                    />
                    <Tab
                        label={`Clubs (${stats.totalClubs})`}
                        icon={<GroupsIcon />}
                        sx={{ minWidth: 120 }}
                    />
                    <Tab
                        label={`Events (${stats.totalEvents})`}
                        icon={<EventIcon />}
                        sx={{ minWidth: 120 }}
                    />
                    <Tab
                        label={`Users (${stats.totalUsers})`}
                        icon={<PersonIcon />}
                        sx={{ minWidth: 120 }}
                    />
                    <Tab
                        label={`Universities (${stats.totalUniversities})`}
                        icon={<SchoolIcon />}
                        sx={{ minWidth: 120 }}
                    />
                    <Tab
                        label="Analytics"
                        icon={<AnalyticsIcon />}
                        sx={{ minWidth: 120 }}
                    />
                </Tabs>
            </Box>

            {/* Tab Content - I'll include a sample here, full implementation would be too long */}
            {tabValue === 0 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            Club Creation Requests
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {stats.pendingRequests > 0 && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleBulkApproveClubs}
                                    startIcon={<CheckCircleIcon />}
                                >
                                    Bulk Approve All ({stats.pendingRequests})
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={fetchClubRequests}
                            >
                                Refresh
                            </Button>
                        </Box>
                    </Box>

                    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Club Name</strong></TableCell>
                                    <TableCell><strong>Requested By</strong></TableCell>
                                    <TableCell><strong>University</strong></TableCell>
                                    <TableCell><strong>Category</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clubRequests.map((request) => (
                                    <TableRow key={request._id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {request.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                    {request.requestedBy?.name?.charAt(0)}
                                                </Avatar>
                                                {request.requestedBy?.name || 'Unknown'}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.university?.name || 'Unknown'}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>{request.category}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.status}
                                                color={getStatusColor(request.status)}
                                                icon={getStatusIcon(request.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        onClick={() => handleViewRequest(request)}
                                                        size="small"
                                                        color="info"
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
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {clubRequests.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                            <Typography variant="h6" color="text.secondary">
                                                No club requests found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                All requests have been processed
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Clubs Tab */}
            {tabValue === 1 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            All Clubs ({stats.totalClubs})
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchAllClubs}
                        >
                            Refresh
                        </Button>
                    </Box>

                    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Club Name</strong></TableCell>
                                    <TableCell><strong>Admin</strong></TableCell>
                                    <TableCell><strong>University</strong></TableCell>
                                    <TableCell><strong>Category</strong></TableCell>
                                    <TableCell><strong>Members</strong></TableCell>
                                    <TableCell><strong>Events</strong></TableCell>
                                    <TableCell><strong>Created</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allClubs.map((club) => (
                                    <TableRow key={club._id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {club.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {club.description?.substring(0, 50)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                    {club.admin?.name?.charAt(0)}
                                                </Avatar>
                                                {club.admin?.name || 'No Admin'}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={club.university?.name || 'Unknown'}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>{club.category}</TableCell>
                                        <TableCell>{club.members?.length || 0}</TableCell>
                                        <TableCell>{club.events?.length || 0}</TableCell>
                                        <TableCell>
                                            {new Date(club.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        onClick={() => handleViewClub(club)}
                                                        size="small"
                                                        color="info"
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Club">
                                                    <IconButton
                                                        onClick={() => handleEditClub(club)}
                                                        size="small"
                                                        color="primary"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Club">
                                                    <IconButton
                                                        onClick={() => handleDeleteClub(club)}
                                                        size="small"
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {allClubs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                            <Typography variant="h6" color="text.secondary">
                                                No clubs found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                No clubs have been created yet
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Events Tab */}
            {tabValue === 2 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            All Events ({stats.totalEvents})
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchAllEvents}
                        >
                            Refresh
                        </Button>
                    </Box>

                    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Event Name</strong></TableCell>
                                    <TableCell><strong>Club</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Location</strong></TableCell>
                                    <TableCell><strong>Attendees</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell align="center"><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allEvents.map((event) => (
                                    <TableRow key={event._id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {event.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {event.description?.substring(0, 50)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {event.club?.name || 'No Club'}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(event.startDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(event.startDate).toLocaleTimeString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {typeof event.location === 'object' && event.location ?
                                                `${event.location.city || ''}, ${event.location.state || ''}, ${event.location.country || ''}`.replace(/^,\s*|,\s*$/, '').replace(/,\s*,/g, ',') :
                                                event.location || 'N/A'
                                            }
                                        </TableCell>
                                        <TableCell>{event.attendees?.length || 0}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={new Date(event.startDate) > new Date() ? 'Upcoming' : 'Past'}
                                                color={new Date(event.startDate) > new Date() ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Tooltip title="View Event">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {/* View event logic */ }}
                                                        sx={{ color: 'info.main' }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Event">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {/* Edit event logic */ }}
                                                        sx={{ color: 'warning.main' }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {new Date(event.startDate) > new Date() ? (
                                                    <Tooltip title="Cancel Event">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {/* Cancel event logic */ }}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <CancelIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Delete Event">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {/* Delete event logic */ }}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {allEvents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                            <Typography variant="h6" color="text.secondary">
                                                No events found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                No events have been created yet
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Users Tab */}
            {tabValue === 3 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            All Users ({stats.totalUsers})
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchAllUsers}
                        >
                            Refresh
                        </Button>
                    </Box>

                    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                    <TableCell><strong>Role</strong></TableCell>
                                    <TableCell><strong>University</strong></TableCell>
                                    <TableCell><strong>Major</strong></TableCell>
                                    <TableCell><strong>Joined</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allUsers.map((userData) => (
                                    <TableRow key={userData._id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 32, height: 32 }}>
                                                    {userData.name?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {userData.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID: {userData.studentId || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{userData.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={userData.role}
                                                color={getRoleColor(userData.role)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {userData.university?.name || userData.university || 'N/A'}
                                        </TableCell>
                                        <TableCell>{userData.major || 'N/A'}</TableCell>
                                        <TableCell>
                                            {new Date(userData.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                                <Tooltip title="View Profile">
                                                    <IconButton
                                                        onClick={() => handleViewUser(userData)}
                                                        size="small"
                                                        sx={{ color: 'info.main' }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Role">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleChangeUserRole(userData)}
                                                        sx={{ color: 'warning.main' }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {userData.isBlocked ? (
                                                    <Tooltip title="Unblock User">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleToggleUserStatus(userData._id, true)}
                                                            sx={{ color: 'success.main' }}
                                                        >
                                                            <LockOpenIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Block User">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleToggleUserStatus(userData._id, false)}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <LockIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Delete User">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {/* Delete user logic */ }}
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {allUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                            <Typography variant="h6" color="text.secondary">
                                                No users found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                No users have registered yet
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Universities Tab */}
            {tabValue === 4 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            Universities ({stats.totalUniversities})
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddUniversity}
                            >
                                Add University
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={fetchUniversities}
                            >
                                Refresh
                            </Button>
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
                        {universities.map((university) => (
                            <Grid item xs={12} md={6} lg={4} key={university._id}>
                                <Card sx={{ height: '100%' }}>
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <SchoolIcon />
                                            </Avatar>
                                        }
                                        title={university.name}
                                        subheader={university.code}
                                        action={
                                            <Box>
                                                <IconButton onClick={() => handleEditUniversity(university)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeleteUniversity(university._id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        }
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {typeof university.location === 'object' && university.location ?
                                                `${university.location.city || ''}, ${university.location.state || ''}, ${university.location.country || ''}`.replace(/^,\s*|,\s*$/, '').replace(/,\s*,/g, ',') :
                                                university.location || 'No location specified'
                                            }
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {university.description?.substring(0, 100)}...
                                        </Typography>
                                        {university.website && (
                                            <Typography variant="caption" color="primary">
                                                {university.website}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        {universities.length === 0 && (
                            <Grid item xs={12}>
                                <Card sx={{ p: 4, textAlign: 'center' }}>
                                    <SchoolIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        No universities found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Add universities to get started
                                    </Typography>
                                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddUniversity}>
                                        Add First University
                                    </Button>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}

            {/* Analytics Tab */}
            {tabValue === 5 && (
                <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                        System Analytics
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Platform Overview
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Total Clubs: <strong>{stats.totalClubs}</strong>
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Total Events: <strong>{stats.totalEvents}</strong>
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Total Users: <strong>{stats.totalUsers}</strong>
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Total Universities: <strong>{stats.totalUniversities}</strong>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Recent Activity
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Pending Requests: <strong>{stats.pendingRequests}</strong>
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Approved This Month: <strong>{stats.approvedThisMonth}</strong>
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Active Users Today: <strong>{stats.activeUsersToday}</strong>
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            New Users This Month: <strong>{stats.recentJoins}</strong>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* User Detail Dialog */}
            <Dialog
                open={userDetailDialogOpen}
                onClose={() => setUserDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    User Details
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedUser && (
                        <Box>
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Name"
                                        secondary={selectedUser.name}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Email"
                                        secondary={selectedUser.email}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Role"
                                        secondary={
                                            <Chip
                                                label={selectedUser.role}
                                                color={getRoleColor(selectedUser.role)}
                                                size="small"
                                            />
                                        }
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="University"
                                        secondary={selectedUser.university?.name || selectedUser.university || 'Not specified'}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Student ID"
                                        secondary={selectedUser.studentId || 'Not provided'}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Major"
                                        secondary={selectedUser.major || 'Not specified'}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Year"
                                        secondary={selectedUser.year || 'Not specified'}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Joined"
                                        secondary={new Date(selectedUser.createdAt).toLocaleDateString()}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUserDetailDialogOpen(false)}>Close</Button>
                    <Button
                        onClick={() => {
                            setUserDetailDialogOpen(false);
                            handleChangeUserRole(selectedUser);
                        }}
                        variant="outlined"
                        startIcon={<EditIcon />}
                    >
                        Change Role
                    </Button>
                </DialogActions>
            </Dialog>

            {/* University Management Dialog */}
            <Dialog
                open={universityDialogOpen}
                onClose={() => setUniversityDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    {editingUniversity ? 'Edit University' : 'Add University'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="University Name"
                            value={universityFormData.name}
                            onChange={(e) => setUniversityFormData(prev => ({ ...prev, name: e.target.value }))}
                            fullWidth
                            required
                        />
                        <TextField
                            label="University Code"
                            value={universityFormData.code}
                            onChange={(e) => setUniversityFormData(prev => ({ ...prev, code: e.target.value }))}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Location"
                            value={universityFormData.location}
                            onChange={(e) => setUniversityFormData(prev => ({ ...prev, location: e.target.value }))}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={universityFormData.description}
                            onChange={(e) => setUniversityFormData(prev => ({ ...prev, description: e.target.value }))}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Website"
                            value={universityFormData.website}
                            onChange={(e) => setUniversityFormData(prev => ({ ...prev, website: e.target.value }))}
                            fullWidth
                        />
                        <TextField
                            label="Contact Email"
                            value={universityFormData.contactEmail}
                            onChange={(e) => setUniversityFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                            fullWidth
                            type="email"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUniversityDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmitUniversity}
                        variant="contained"
                        disabled={!universityFormData.name || !universityFormData.code}
                    >
                        {editingUniversity ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Role Change Dialog */}
            <Dialog
                open={roleChangeDialogOpen}
                onClose={() => setRoleChangeDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: 'warning.main', color: 'white' }}>
                    Change User Role
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {selectedUser && (
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Change role for <strong>{selectedUser.name}</strong> ({selectedUser.email})
                            </Typography>
                        )}
                        <FormControl fullWidth>
                            <InputLabel>New Role</InputLabel>
                            <Select
                                value={newUserRole}
                                onChange={(e) => setNewUserRole(e.target.value)}
                                label="New Role"
                            >
                                <MenuItem value="Student">Student</MenuItem>
                                <MenuItem value="Club Admin">Club Admin</MenuItem>
                                <MenuItem value="Administrator">Administrator</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRoleChangeDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmitRoleChange}
                        variant="contained"
                        color="warning"
                        disabled={!newUserRole}
                    >
                        Change Role
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Request Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    Club Request Details
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedRequest && (
                        <Box>
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
                            </List>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                    {selectedRequest?.status === 'pending' && (
                        <>
                            <Button
                                onClick={() => {
                                    setViewDialogOpen(false);
                                    handleReviewRequest(selectedRequest, 'approved');
                                }}
                                variant="contained"
                                color="success"
                                startIcon={<ThumbUpIcon />}
                            >
                                Approve
                            </Button>
                            <Button
                                onClick={() => {
                                    setViewDialogOpen(false);
                                    handleReviewRequest(selectedRequest, 'rejected');
                                }}
                                variant="contained"
                                color="error"
                                startIcon={<ThumbDownIcon />}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Review Request Dialog */}
            <Dialog
                open={reviewDialogOpen}
                onClose={() => setReviewDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: reviewAction === 'approved' ? 'success.main' : 'error.main', color: 'white' }}>
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
