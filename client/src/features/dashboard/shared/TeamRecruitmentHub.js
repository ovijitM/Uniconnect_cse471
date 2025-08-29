import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../../../config/api';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    LinearProgress,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Group as GroupIcon,
    Add as AddIcon,
    Send as SendIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth/context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

const TeamRecruitmentHub = () => {
    const { user, token } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [recruitmentPosts, setRecruitmentPosts] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [applyDialog, setApplyDialog] = useState({ open: false, post: null });
    const [createDialog, setCreateDialog] = useState(false);
    const [viewDialog, setViewDialog] = useState({ open: false, post: null });

    // Form states
    const [applicationForm, setApplicationForm] = useState({
        message: '',
        skills: [],
        portfolio: '',
        experience: ''
    });

    const [createForm, setCreateForm] = useState({
        eventId: '',
        title: '',
        description: '',
        requiredSkills: [],
        preferredSkills: [],
        teamSize: 2,
        requirements: '',
        contactMethod: 'Application',
        contactInfo: '',
        priority: 'Medium',
        deadline: '',
        tags: []
    });

    const skillOptions = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MongoDB',
        'SQL', 'Design', 'UI/UX', 'Marketing', 'Project Management',
        'Data Analysis', 'Machine Learning', 'Mobile Development'
    ];

    const fetchData = useCallback(async () => {
        if (!token) {
            console.log('No token found, skipping team recruitment data fetch');
            return;
        }

        try {
            setLoading(true);
            const universityId = user?.university?._id || user?.university;

            const headers = { Authorization: `Bearer ${token}` };

            const [postsRes, applicationsRes, myPostsRes, eventsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/team-recruitment?university=${universityId}`),
                axios.get(`${API_BASE_URL}/team-recruitment/user/applications`, { headers }),
                axios.get(`${API_BASE_URL}/team-recruitment/user/posts`, { headers }),
                axios.get(`${API_BASE_URL}/events?university=${universityId}&upcoming=true`)
            ]);

            setRecruitmentPosts(postsRes.data.recruitments || []);
            setMyApplications(applicationsRes.data.applications || []);
            setMyPosts(myPostsRes.data.posts || []);
            setEvents(eventsRes.data.events || []);

        } catch (error) {
            console.error('Error fetching team recruitment data:', error);
        } finally {
            setLoading(false);
        }
    }, [token, user]); useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApply = async () => {
        try {
            await axios.post(`${API_BASE_URL}/team-recruitment/${applyDialog.post._id}/apply`,
                applicationForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setApplyDialog({ open: false, post: null });
            setApplicationForm({ message: '', skills: [], portfolio: '', experience: '' });
            fetchData();
            alert('Application submitted successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit application');
        }
    };

    const handleCreatePost = async () => {
        try {
            await axios.post(`${API_BASE_URL}/team-recruitment/events/${createForm.eventId}`,
                createForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCreateDialog(false);
            setCreateForm({
                eventId: '',
                title: '',
                description: '',
                requiredSkills: [],
                preferredSkills: [],
                teamSize: 2,
                requirements: '',
                contactMethod: 'Application',
                contactInfo: '',
                priority: 'Medium',
                deadline: '',
                tags: []
            });
            fetchData();
            alert('Team recruitment post created successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create post');
        }
    };

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted': return 'success';
            case 'Rejected': return 'error';
            case 'Pending': return 'warning';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Accepted': return <CheckCircleIcon />;
            case 'Rejected': return <CancelIcon />;
            case 'Pending': return <PendingIcon />;
            default: return <PendingIcon />;
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <LinearProgress sx={{ width: '50%' }} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    🤝 Team Recruitment Hub
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateDialog(true)}
                >
                    Create Post
                </Button>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab label={`Browse Posts (${recruitmentPosts.length})`} />
                    <Tab label={`My Applications (${myApplications.length})`} />
                    <Tab label={`My Posts (${myPosts.length})`} />
                </Tabs>
            </Box>

            {/* Browse Posts Tab */}
            {tabValue === 0 && (
                <Grid container spacing={3}>
                    {recruitmentPosts.length === 0 ? (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                No team recruitment posts available at the moment.
                            </Alert>
                        </Grid>
                    ) : (
                        recruitmentPosts.map((post) => (
                            <Grid item xs={12} md={6} lg={4} key={post._id}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <GroupIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {post.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    by {post.poster?.name}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {post.description?.substring(0, 100)}...
                                        </Typography>

                                        <Box mb={2}>
                                            <Typography variant="caption" color="text.secondary">
                                                Event: {post.event?.title}
                                            </Typography>
                                            <br />
                                            <Typography variant="caption" color="text.secondary">
                                                Team Size: {post.teamSize} | Priority: {post.priority}
                                            </Typography>
                                        </Box>

                                        {post.requiredSkills?.length > 0 && (
                                            <Box mb={2}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Required Skills:
                                                </Typography>
                                                <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                                                    {post.requiredSkills.slice(0, 3).map((skill, index) => (
                                                        <Chip key={index} label={skill} size="small" />
                                                    ))}
                                                    {post.requiredSkills.length > 3 && (
                                                        <Chip label={`+${post.requiredSkills.length - 3} more`} size="small" />
                                                    )}
                                                </Box>
                                            </Box>
                                        )}

                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="caption" color="text.secondary">
                                                Deadline: {post.deadline ? formatDate(post.deadline) : 'TBD'}
                                            </Typography>
                                            <Box>
                                                <Button
                                                    size="small"
                                                    onClick={() => setViewDialog({ open: true, post })}
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={<SendIcon />}
                                                    onClick={() => setApplyDialog({ open: true, post })}
                                                    disabled={post.poster?._id === user?._id}
                                                >
                                                    Apply
                                                </Button>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}

            {/* My Applications Tab */}
            {tabValue === 1 && (
                <Box>
                    {myApplications.length === 0 ? (
                        <Alert severity="info">
                            You haven't applied to any team recruitment posts yet.
                        </Alert>
                    ) : (
                        <List>
                            {myApplications.map((application, index) => (
                                <React.Fragment key={application._id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: getStatusColor(application.status) + '.main' }}>
                                                {getStatusIcon(application.status)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={application.recruitment?.title}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2">
                                                        Applied on: {formatDate(application.appliedAt)}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Event: {application.recruitment?.event?.title}
                                                    </Typography>
                                                    <Chip
                                                        label={application.status}
                                                        color={getStatusColor(application.status)}
                                                        size="small"
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < myApplications.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Box>
            )}

            {/* My Posts Tab */}
            {tabValue === 2 && (
                <Grid container spacing={3}>
                    {myPosts.length === 0 ? (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                You haven't created any team recruitment posts yet.
                            </Alert>
                        </Grid>
                    ) : (
                        myPosts.map((post) => (
                            <Grid item xs={12} md={6} key={post._id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {post.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {post.description?.substring(0, 150)}...
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="caption" color="text.secondary">
                                                {post.applications?.length || 0} applications
                                            </Typography>
                                            <Chip
                                                label={post.status}
                                                color={post.status === 'Active' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}

            {/* Apply Dialog */}
            <Dialog open={applyDialog.open} onClose={() => setApplyDialog({ open: false, post: null })} maxWidth="sm" fullWidth>
                <DialogTitle>Apply to Join Team</DialogTitle>
                <DialogContent>
                    {applyDialog.post && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                {applyDialog.post.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Event: {applyDialog.post.event?.title}
                            </Typography>

                            <TextField
                                label="Application Message"
                                multiline
                                rows={4}
                                fullWidth
                                value={applicationForm.message}
                                onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                                placeholder="Why do you want to join this team? What can you contribute?"
                                sx={{ mt: 2, mb: 2 }}
                                required
                            />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Your Skills</InputLabel>
                                <Select
                                    multiple
                                    value={applicationForm.skills}
                                    onChange={(e) => setApplicationForm({ ...applicationForm, skills: e.target.value })}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {skillOptions.map((skill) => (
                                        <MenuItem key={skill} value={skill}>
                                            {skill}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Portfolio/LinkedIn URL (Optional)"
                                fullWidth
                                value={applicationForm.portfolio}
                                onChange={(e) => setApplicationForm({ ...applicationForm, portfolio: e.target.value })}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                label="Relevant Experience (Optional)"
                                multiline
                                rows={2}
                                fullWidth
                                value={applicationForm.experience}
                                onChange={(e) => setApplicationForm({ ...applicationForm, experience: e.target.value })}
                                placeholder="Brief description of relevant experience..."
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApplyDialog({ open: false, post: null })}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={handleApply}
                        disabled={!applicationForm.message.trim()}
                    >
                        Submit Application
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Post Dialog */}
            <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create Team Recruitment Post</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Select Event</InputLabel>
                                <Select
                                    value={createForm.eventId}
                                    onChange={(e) => setCreateForm({ ...createForm, eventId: e.target.value })}
                                >
                                    {events.map((event) => (
                                        <MenuItem key={event._id} value={event._id}>
                                            {event.title} - {formatDate(event.startDate)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Post Title"
                                fullWidth
                                required
                                value={createForm.title}
                                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                placeholder="e.g., Looking for Frontend Developer for Hackathon Team"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                multiline
                                rows={4}
                                fullWidth
                                required
                                value={createForm.description}
                                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                placeholder="Describe your project, what you're looking for, and team goals..."
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Team Size"
                                type="number"
                                fullWidth
                                value={createForm.teamSize}
                                onChange={(e) => setCreateForm({ ...createForm, teamSize: parseInt(e.target.value) || 2 })}
                                inputProps={{ min: 2, max: 10 }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={createForm.priority}
                                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                                >
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Requirements"
                                multiline
                                rows={2}
                                fullWidth
                                value={createForm.requirements}
                                onChange={(e) => setCreateForm({ ...createForm, requirements: e.target.value })}
                                placeholder="Additional requirements or expectations..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Application Deadline"
                                type="date"
                                fullWidth
                                value={createForm.deadline}
                                onChange={(e) => setCreateForm({ ...createForm, deadline: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreatePost}
                        disabled={!createForm.eventId || !createForm.title.trim() || !createForm.description.trim()}
                    >
                        Create Post
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Details Dialog */}
            <Dialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, post: null })} maxWidth="sm" fullWidth>
                <DialogTitle>Team Recruitment Details</DialogTitle>
                <DialogContent>
                    {viewDialog.post && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                {viewDialog.post.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Posted by: {viewDialog.post.poster?.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Event: {viewDialog.post.event?.title}
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                                {viewDialog.post.description}
                            </Typography>

                            {viewDialog.post.requirements && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Requirements:
                                    </Typography>
                                    <Typography variant="body2">
                                        {viewDialog.post.requirements}
                                    </Typography>
                                </Box>
                            )}

                            {viewDialog.post.requiredSkills?.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Required Skills:
                                    </Typography>
                                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                                        {viewDialog.post.requiredSkills.map((skill, index) => (
                                            <Chip key={index} label={skill} size="small" color="primary" />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Team Size: {viewDialog.post.teamSize}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Priority: {viewDialog.post.priority}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialog({ open: false, post: null })}>
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={() => {
                            setViewDialog({ open: false, post: null });
                            setApplyDialog({ open: true, post: viewDialog.post });
                        }}
                        disabled={viewDialog.post?.poster?._id === user?._id}
                    >
                        Apply Now
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeamRecruitmentHub;
