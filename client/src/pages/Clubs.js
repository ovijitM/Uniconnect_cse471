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
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const Clubs = () => {
    const { user } = useAuth();
    const [clubs, setClubs] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [universityFilter, setUniversityFilter] = useState('All');
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
        fetchUniversities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, category, universityFilter]);

    const fetchClubs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '9'
            });

            if (search) params.append('search', search);
            if (category && category !== 'All') params.append('category', category);
            if (universityFilter && universityFilter !== 'All') params.append('university', universityFilter);

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

    const fetchUniversities = async () => {
        try {
            const response = await axios.get('/api/universities');
            setUniversities(response.data.universities || []);
        } catch (error) {
            console.error('Error fetching universities:', error);
            setUniversities([]);
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
                    <Grid item xs={12} sm={6} md={3}>
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
                    <Grid item xs={12} sm={12} md={2}>
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
                                            position: 'relative',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            cursor: 'pointer',
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            '&:hover': {
                                                transform: 'translateY(-8px) scale(1.02)',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                                '& .club-avatar': {
                                                    transform: 'scale(1.1)',
                                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                                },
                                                '& .club-join-btn': {
                                                    transform: 'scale(1.05)'
                                                }
                                            }
                                        }}
                                    >
                                        {/* Header Section with Gradient Background */}
                                        <Box
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                p: 3,
                                                pb: 4,
                                                position: 'relative'
                                            }}
                                        >
                                            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                                                <Chip
                                                    label={club.category || 'General'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(255,255,255,0.2)',
                                                        color: 'white',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                                <Avatar
                                                    className="club-avatar"
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        mb: 2,
                                                        bgcolor: 'rgba(255,255,255,0.95)',
                                                        color: '#667eea',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                                    }}
                                                >
                                                    <GroupsIcon sx={{ fontSize: 40 }} />
                                                </Avatar>

                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 700,
                                                        fontSize: '1.25rem',
                                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        lineHeight: 1.2
                                                    }}
                                                >
                                                    {club.name}
                                                </Typography>

                                                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            bgcolor: club.isActive ? '#4caf50' : '#f44336'
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'rgba(255,255,255,0.9)',
                                                            fontWeight: 500,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px'
                                                        }}
                                                    >
                                                        {club.isActive ? 'Active' : 'Inactive'}
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
                                                {club.description || 'Join this amazing club and connect with like-minded students!'}
                                            </Typography>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: 2,
                                                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            mr: 2
                                                        }}
                                                    >
                                                        <PersonIcon sx={{ fontSize: 18, color: '#667eea' }} />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                                                            President
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {club.president?.name || 'TBA'}
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
                                                        <GroupsIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                                                            Members
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {club.members?.length || 0} students
                                                            </Typography>
                                                            {club.membershipFee > 0 && (
                                                                <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 600 }}>
                                                                    ${club.membershipFee}
                                                                </Typography>
                                                            )}
                                                        </Box>
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
                                                        <EmailIcon sx={{ fontSize: 18, color: '#3f51b5' }} />
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
                                                            Contact
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
                                                            {club.contactEmail || 'Not provided'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>

                                        <CardActions sx={{ p: 3, pt: 0 }}>
                                            {!isUserMember(club) ? (
                                                <Button
                                                    className="club-join-btn"
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    startIcon={<PersonAddIcon />}
                                                    onClick={() => handleJoinClub(club._id)}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        borderRadius: 2,
                                                        py: 1.5,
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        textTransform: 'none',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                                                        }
                                                    }}
                                                >
                                                    Join Club
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
                                                    ✓ Already Joined
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
