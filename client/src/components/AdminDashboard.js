import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalClubs: 0,
        totalEvents: 0,
        activeUsers: 0
    });
    const [users, setUsers] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [usersRes, clubsRes, eventsRes] = await Promise.all([
                axios.get('/api/users'),
                axios.get('/api/clubs'),
                axios.get('/api/events')
            ]);

            setUsers(usersRes.data.users || []);
            setClubs(clubsRes.data.clubs || []);

            setStats({
                totalUsers: usersRes.data.users?.length || 0,
                totalClubs: clubsRes.data.clubs?.length || 0,
                totalEvents: eventsRes.data.events?.length || 0,
                activeUsers: usersRes.data.users?.filter(u => u.isActive).length || 0
            });
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivateUser = async (userId) => {
        try {
            await axios.patch(`/api/users/${userId}/deactivate`);
            fetchAdminData();
        } catch (error) {
            console.error('Error deactivating user:', error);
            alert('Failed to update user status');
        }
    };

    const handleDeleteClub = async (clubId) => {
        if (window.confirm('Are you sure you want to delete this club?')) {
            try {
                await axios.delete(`/api/clubs/${clubId}`);
                fetchAdminData();
            } catch (error) {
                console.error('Error deleting club:', error);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
            {/* Welcome Section */}
            <Paper
                sx={{
                    p: 4,
                    mb: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 2
                }}
            >
                <Typography variant="h3" gutterBottom fontWeight="bold">
                    Administrator Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Welcome, {user?.name} - System Administrator
                </Typography>
            </Paper>

            {/* Stats Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <CardContent>
                            <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
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
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <CardContent>
                            <GroupsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {stats.totalClubs}
                            </Typography>
                            <Typography color="text.secondary">
                                Active Clubs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <CardContent>
                            <EventIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
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
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                        <CardContent>
                            <Typography variant="h4" fontWeight="bold" color="success.main">
                                {stats.activeUsers}
                            </Typography>
                            <Typography color="text.secondary">
                                Active Users
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* User Management Section */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            User Management
                        </Typography>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>University</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.slice(0, 10).map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                color={user.role === 'Administrator' ? 'error' : user.role === 'Club Admin' ? 'warning' : 'primary'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{user.university?.name || user.university}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.isActive ? 'Active' : 'Inactive'}
                                                color={user.isActive ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeactivateUser(user._id)}
                                                disabled={user.role === 'Administrator'}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Club Management Section */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            Club Management
                        </Typography>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Club Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>President</TableCell>
                                    <TableCell>Members</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clubs.slice(0, 10).map((club) => (
                                    <TableRow key={club._id}>
                                        <TableCell>{club.name}</TableCell>
                                        <TableCell>
                                            <Chip label={club.category} size="small" />
                                        </TableCell>
                                        <TableCell>{club.president?.name || 'TBD'}</TableCell>
                                        <TableCell>{club.members?.length || 0}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={club.isActive ? 'Active' : 'Inactive'}
                                                color={club.isActive ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small" color="primary">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteClub(club._id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AdminDashboard;
