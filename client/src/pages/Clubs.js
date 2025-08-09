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
    DialogActions
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const Clubs = () => {
    const { user } = useAuth();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newClub, setNewClub] = useState({
        name: '',
        description: '',
        category: 'Academic',
        contactEmail: '',
        membershipFee: 0
    });

    const categories = [
        'All', 'Academic', 'Sports', 'Cultural', 'Technical', 'Social Service',
        'Arts', 'Music', 'Drama', 'Photography', 'Literature', 'Other'
    ];

    useEffect(() => {
        fetchClubs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, category]);

    const fetchClubs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '9'
            });

            if (search) params.append('search', search);
            if (category && category !== 'All') params.append('category', category);

            // Filter by user's university if authenticated
            const universityId = user?.university?._id || user?.university;
            if (universityId) {
                params.append('university', universityId);
            }

            const response = await axios.get(`/api/clubs?${params}`);

            setClubs(response.data.clubs || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            setClubs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClub = async (clubId) => {
        try {
            await axios.post(`/api/clubs/${clubId}/join`);
            fetchClubs(); // Refresh data
        } catch (error) {
            console.error('Error joining club:', error);
            alert(error.response?.data?.message || 'Failed to join club');
        }
    };

    const handleCreateClub = async () => {
        try {
            await axios.post('/api/clubs', newClub);
            setCreateDialogOpen(false);
            setNewClub({
                name: '',
                description: '',
                category: 'Academic',
                contactEmail: '',
                membershipFee: 0
            });
            fetchClubs(); // Refresh data
        } catch (error) {
            console.error('Error creating club:', error);
            alert(error.response?.data?.message || 'Failed to create club');
        }
    };

    const isUserMember = (club) => {
        return club.members?.some(member => member.user._id === user?._id);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                    University Clubs
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Discover and join clubs that match your interests
                </Typography>
            </Box>

            {/* Search and Filter Section */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Search clubs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5}>
                        <Typography variant="body2" color="text.secondary">
                            Found {clubs.length} clubs
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Clubs Grid */}
            {loading ? (
                <Typography textAlign="center">Loading clubs...</Typography>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {clubs.length === 0 ? (
                            <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" textAlign="center">
                                    No clubs found matching your criteria
                                </Typography>
                            </Grid>
                        ) : (
                            clubs.map((club) => (
                                <Grid item xs={12} sm={6} md={4} key={club._id}>
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
                                                        bgcolor: 'primary.main'
                                                    }}
                                                >
                                                    <GroupsIcon fontSize="large" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                        {club.name}
                                                    </Typography>
                                                    <Chip
                                                        label={club.category}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {club.description?.length > 120
                                                    ? `${club.description.substring(0, 120)}...`
                                                    : club.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Members:</strong> {club.members?.length || 0}
                                                </Typography>
                                                {club.membershipFee > 0 && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Fee:</strong> ${club.membershipFee}
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Typography variant="body2" color="text.secondary">
                                                <strong>President:</strong> {club.president?.name || 'TBD'}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Contact:</strong> {club.contactEmail}
                                            </Typography>
                                        </CardContent>

                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            {!isUserMember(club) ? (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<PersonAddIcon />}
                                                    onClick={() => handleJoinClub(club._id)}
                                                >
                                                    Join Club
                                                </Button>
                                            ) : (
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    color="success"
                                                    disabled
                                                >
                                                    ✓ Member
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

            {/* Floating Action Button for Creating Club */}
            {user && (user.role === 'Club Admin' || user.role === 'Administrator') && (
                <Fab
                    color="primary"
                    aria-label="create club"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    onClick={() => setCreateDialogOpen(true)}
                >
                    <AddIcon />
                </Fab>
            )}            {/* Create Club Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Create New Club</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Club Name"
                            value={newClub.name}
                            onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            value={newClub.description}
                            onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={newClub.category}
                                label="Category"
                                onChange={(e) => setNewClub({ ...newClub, category: e.target.value })}
                            >
                                {categories.slice(1).map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Contact Email"
                            type="email"
                            value={newClub.contactEmail}
                            onChange={(e) => setNewClub({ ...newClub, contactEmail: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Membership Fee ($)"
                            type="number"
                            value={newClub.membershipFee}
                            onChange={(e) => setNewClub({ ...newClub, membershipFee: parseFloat(e.target.value) || 0 })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreateClub}
                        variant="contained"
                        disabled={!newClub.name || !newClub.description}
                    >
                        Create Club
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Clubs;
