import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Avatar,
    Divider,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    Tabs,
    Tab,
    Paper,
    IconButton,
    Badge,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Group as GroupIcon,
    Send as SendIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const TeamRecruitmentSection = ({ eventId }) => {
    const { user, token } = useAuth();
    const [recruitments, setRecruitments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(0);
    const [filters] = useState({
        status: 'all',
        skills: '',
        sortBy: 'newest'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        hasMore: false
    });

    // Dialog states
    const [dialogs, setDialogs] = useState({
        create: false,
        view: false,
        apply: false,
        manage: false
    });

    // Form states
    const [createForm, setCreateForm] = useState({
        title: '',
        description: '',
        teamSize: 2,
        requiredSkills: [],
        preferredSkills: [],
        requirements: '',
        contactMethod: 'Application',
        contactInfo: '',
        priority: 'Medium',
        deadline: '',
        tags: []
    });

    const [selectedRecruitment, setSelectedRecruitment] = useState(null);
    const [applicationForm, setApplicationForm] = useState({
        message: '',
        skills: [],
        portfolio: '',
        experience: ''
    });

    const [userApplications, setUserApplications] = useState([]);
    const [userPosts, setUserPosts] = useState([]);

    const skillOptions = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MongoDB',
        'SQL', 'Design', 'UI/UX', 'Marketing', 'Project Management',
        'Data Analysis', 'Machine Learning', 'Mobile Development',
        'DevOps', 'Testing', 'Writing', 'Research'
    ];

    const priorityColors = {
        High: 'error',
        Medium: 'warning',
        Low: 'success'
    };

    const statusColors = {
        Active: 'success',
        'In Progress': 'info',
        Completed: 'default',
        Cancelled: 'error'
    };

    // Define functions before useEffect hooks
    const fetchRecruitments = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                status: filters.status,
                sortBy: filters.sortBy,
                page: pagination.page,
                limit: 10
            });

            if (filters.skills) {
                queryParams.append('skills', filters.skills);
            }

            const response = await fetch(`/api/team-recruitment/events/${eventId}?${queryParams}`);
            const data = await response.json();

            if (response.ok) {
                setRecruitments(data.recruitments);
                setPagination({
                    page: data.currentPage,
                    totalPages: data.totalPages,
                    hasMore: data.hasMore
                });
            }
        } catch (error) {
            console.error('Error fetching recruitments:', error);
        } finally {
            setLoading(false);
        }
    }, [eventId, filters.status, filters.sortBy, filters.skills, pagination.page]);

    const fetchUserApplications = useCallback(async () => {
        try {
            const response = await fetch('/api/team-recruitment/user/applications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUserApplications(data.applications);
            }
        } catch (error) {
            console.error('Error fetching user applications:', error);
        }
    }, [token]);

    const fetchUserPosts = useCallback(async () => {
        try {
            const response = await fetch('/api/team-recruitment/user/posts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUserPosts(data.posts);
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    }, [token]);

    useEffect(() => {
        fetchRecruitments();
    }, [fetchRecruitments]);

    useEffect(() => {
        if (user && currentTab === 1) {
            fetchUserApplications();
        }
        if (user && currentTab === 2) {
            fetchUserPosts();
        }
    }, [currentTab, user, fetchUserApplications, fetchUserPosts]);

    const handleCreateRecruitment = async () => {
        try {
            if (!token) {
                alert('Authentication required. Please log in again.');
                return;
            }

            const response = await fetch(`/api/team-recruitment/events/${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(createForm)
            });

            const data = await response.json();

            if (response.ok) {
                setDialogs({ ...dialogs, create: false });
                setCreateForm({
                    title: '',
                    description: '',
                    teamSize: 2,
                    requiredSkills: [],
                    preferredSkills: [],
                    requirements: '',
                    contactMethod: 'Application',
                    contactInfo: '',
                    priority: 'Medium',
                    deadline: '',
                    tags: []
                });
                fetchRecruitments();
            } else {
                alert(data.message || 'Error creating recruitment post');
            }
        } catch (error) {
            console.error('Error creating recruitment:', error);
            alert('Error creating recruitment post');
        }
    };

    const handleApplyToTeam = async () => {
        try {
            const response = await fetch(`/api/team-recruitment/${selectedRecruitment._id}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(applicationForm)
            });

            const data = await response.json();

            if (response.ok) {
                setDialogs({ ...dialogs, apply: false });
                setApplicationForm({
                    message: '',
                    skills: [],
                    portfolio: '',
                    experience: ''
                });
                alert('Application submitted successfully!');
                fetchRecruitments();
            } else {
                alert(data.message || 'Error submitting application');
            }
        } catch (error) {
            console.error('Error applying to team:', error);
            alert('Error submitting application');
        }
    };

    const openViewDialog = async (recruitmentId) => {
        try {
            const response = await fetch(`/api/team-recruitment/${recruitmentId}`);
            const data = await response.json();

            if (response.ok) {
                setSelectedRecruitment(data.recruitment);
                setDialogs({ ...dialogs, view: true });
            }
        } catch (error) {
            console.error('Error fetching recruitment details:', error);
        }
    };

    const renderRecruitmentCard = (recruitment) => (
        <Card key={recruitment._id} sx={{ mb: 2, position: 'relative' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ flex: 1, mr: 2 }}>
                        {recruitment.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            label={recruitment.priority}
                            color={priorityColors[recruitment.priority]}
                            size="small"
                        />
                        <Chip
                            label={recruitment.status}
                            color={statusColors[recruitment.status]}
                            size="small"
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                        <PersonIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                        {recruitment.poster?.name} • {format(new Date(recruitment.createdAt), 'MMM dd')}
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupIcon fontSize="small" />
                        <Typography variant="body2">
                            {recruitment.currentMembers?.length || 0}/{recruitment.teamSize}
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {recruitment.description?.substring(0, 150)}...
                </Typography>

                {recruitment.requiredSkills?.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        {recruitment.requiredSkills.slice(0, 3).map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                variant="outlined"
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                            />
                        ))}
                        {recruitment.requiredSkills.length > 3 && (
                            <Chip
                                label={`+${recruitment.requiredSkills.length - 3} more`}
                                variant="outlined"
                                size="small"
                            />
                        )}
                    </Box>
                )}

                {recruitment.deadline && (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <ScheduleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="caption">
                            Apply by {format(new Date(recruitment.deadline), 'MMM dd, yyyy')}
                        </Typography>
                    </Box>
                )}
            </CardContent>

            <CardActions>
                <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => openViewDialog(recruitment._id)}
                >
                    View Details
                </Button>

                {user && user._id !== recruitment.poster?._id && recruitment.status === 'Active' && (
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={() => {
                            setSelectedRecruitment(recruitment);
                            setDialogs({ ...dialogs, apply: true });
                        }}
                        disabled={recruitment.currentMembers?.some(member => member._id === user._id)}
                    >
                        {recruitment.currentMembers?.some(member => member._id === user._id) ? 'Already Member' : 'Apply'}
                    </Button>
                )}

                {user && user._id === recruitment.poster?._id && (
                    <Box sx={{ ml: 'auto' }}>
                        <IconButton size="small">
                            <EditIcon />
                        </IconButton>
                        <Badge badgeContent={recruitment.applications?.length || 0} color="primary">
                            <IconButton size="small">
                                <GroupIcon />
                            </IconButton>
                        </Badge>
                    </Box>
                )}
            </CardActions>
        </Card>
    );

    const renderCreateDialog = () => (
        <Dialog open={dialogs.create} onClose={() => setDialogs({ ...dialogs, create: false })} maxWidth="md" fullWidth>
            <DialogTitle>Create Team Recruitment Post</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={createForm.title}
                        onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                        sx={{ mb: 2 }}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={createForm.description}
                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                        sx={{ mb: 2 }}
                        required
                    />

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Team Size"
                                type="number"
                                value={createForm.teamSize}
                                onChange={(e) => setCreateForm({ ...createForm, teamSize: parseInt(e.target.value) })}
                                inputProps={{ min: 2, max: 20 }}
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
                    </Grid>

                    <Autocomplete
                        multiple
                        options={skillOptions}
                        value={createForm.requiredSkills}
                        onChange={(e, value) => setCreateForm({ ...createForm, requiredSkills: value })}
                        renderInput={(params) => (
                            <TextField {...params} label="Required Skills" />
                        )}
                        sx={{ mb: 2 }}
                    />

                    <Autocomplete
                        multiple
                        options={skillOptions}
                        value={createForm.preferredSkills}
                        onChange={(e, value) => setCreateForm({ ...createForm, preferredSkills: value })}
                        renderInput={(params) => (
                            <TextField {...params} label="Preferred Skills (Optional)" />
                        )}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Additional Requirements"
                        multiline
                        rows={2}
                        value={createForm.requirements}
                        onChange={(e) => setCreateForm({ ...createForm, requirements: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Application Deadline"
                        type="datetime-local"
                        value={createForm.deadline}
                        onChange={(e) => setCreateForm({ ...createForm, deadline: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogs({ ...dialogs, create: false })}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleCreateRecruitment}
                    disabled={!createForm.title || !createForm.description}
                >
                    Create Post
                </Button>
            </DialogActions>
        </Dialog>
    );

    const renderViewDialog = () => (
        <Dialog
            open={dialogs.view}
            onClose={() => setDialogs({ ...dialogs, view: false })}
            maxWidth="md"
            fullWidth
        >
            {selectedRecruitment && (
                <>
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {selectedRecruitment.title}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                    label={selectedRecruitment.priority}
                                    color={priorityColors[selectedRecruitment.priority]}
                                    size="small"
                                />
                                <Chip
                                    label={selectedRecruitment.status}
                                    color={statusColors[selectedRecruitment.status]}
                                    size="small"
                                />
                            </Box>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" paragraph>
                            {selectedRecruitment.description}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" gutterBottom>Team Size</Typography>
                                <Typography variant="body2">
                                    {selectedRecruitment.currentMembers?.length || 0} / {selectedRecruitment.teamSize} members
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" gutterBottom>Views</Typography>
                                <Typography variant="body2">{selectedRecruitment.views || 0}</Typography>
                            </Grid>
                        </Grid>

                        {selectedRecruitment.requiredSkills?.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>Required Skills</Typography>
                                <Box>
                                    {selectedRecruitment.requiredSkills.map((skill, index) => (
                                        <Chip
                                            key={index}
                                            label={skill}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {selectedRecruitment.preferredSkills?.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>Preferred Skills</Typography>
                                <Box>
                                    {selectedRecruitment.preferredSkills.map((skill, index) => (
                                        <Chip
                                            key={index}
                                            label={skill}
                                            size="small"
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {selectedRecruitment.requirements && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>Additional Requirements</Typography>
                                <Typography variant="body2">{selectedRecruitment.requirements}</Typography>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>Current Team Members</Typography>
                            {selectedRecruitment.currentMembers?.map((member) => (
                                <Chip
                                    key={member._id}
                                    avatar={<Avatar>{member.name?.charAt(0)}</Avatar>}
                                    label={`${member.name} (${member.major})`}
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                />
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogs({ ...dialogs, view: false })}>Close</Button>
                        {user && user._id !== selectedRecruitment.poster?._id && selectedRecruitment.status === 'Active' && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setDialogs({ ...dialogs, view: false, apply: true });
                                }}
                                disabled={selectedRecruitment.currentMembers?.some(member => member._id === user._id)}
                            >
                                Apply to Join
                            </Button>
                        )}
                    </DialogActions>
                </>
            )}
        </Dialog>
    );

    const renderApplicationDialog = () => (
        <Dialog
            open={dialogs.apply}
            onClose={() => setDialogs({ ...dialogs, apply: false })}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Apply to Join Team</DialogTitle>
            <DialogContent>
                {selectedRecruitment && (
                    <Box sx={{ pt: 1 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Applying for: <strong>{selectedRecruitment.title}</strong>
                        </Alert>

                        <TextField
                            fullWidth
                            label="Why do you want to join this team?"
                            multiline
                            rows={4}
                            value={applicationForm.message}
                            onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />

                        <Autocomplete
                            multiple
                            options={skillOptions}
                            value={applicationForm.skills}
                            onChange={(e, value) => setApplicationForm({ ...applicationForm, skills: value })}
                            renderInput={(params) => (
                                <TextField {...params} label="Your Skills" />
                            )}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Portfolio/GitHub Link (Optional)"
                            value={applicationForm.portfolio}
                            onChange={(e) => setApplicationForm({ ...applicationForm, portfolio: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Relevant Experience (Optional)"
                            multiline
                            rows={2}
                            value={applicationForm.experience}
                            onChange={(e) => setApplicationForm({ ...applicationForm, experience: e.target.value })}
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogs({ ...dialogs, apply: false })}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleApplyToTeam}
                    disabled={!applicationForm.message}
                >
                    Submit Application
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="All Teams" />
                    {user && <Tab label="My Applications" />}
                    {user && <Tab label="My Posts" />}
                </Tabs>
            </Box>

            {currentTab === 0 && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" component="h2">
                            Team Recruitment
                        </Typography>
                        {user && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setDialogs({ ...dialogs, create: true })}
                            >
                                Post Team Need
                            </Button>
                        )}
                    </Box>

                    {/* Filter controls can be added here */}

                    <Box>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : recruitments.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <GroupIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    No team recruitment posts yet
                                </Typography>
                                <Typography color="text.secondary" paragraph>
                                    Be the first to post about needing team members for this event!
                                </Typography>
                                {user && (
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => setDialogs({ ...dialogs, create: true })}
                                    >
                                        Create First Post
                                    </Button>
                                )}
                            </Paper>
                        ) : (
                            recruitments.map(renderRecruitmentCard)
                        )}
                    </Box>
                </>
            )}

            {currentTab === 1 && user && (
                <Box>
                    <Typography variant="h6" gutterBottom>My Applications</Typography>
                    {userApplications.length === 0 ? (
                        <Typography color="text.secondary">No applications yet</Typography>
                    ) : (
                        userApplications.map((app) => (
                            <Card key={app._id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{app.title}</Typography>
                                    <Typography color="text.secondary">
                                        Event: {app.event?.title}
                                    </Typography>
                                    <Typography variant="body2">
                                        Status: {app.application?.status}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            )}

            {currentTab === 2 && user && (
                <Box>
                    <Typography variant="h6" gutterBottom>My Posts</Typography>
                    {userPosts.length === 0 ? (
                        <Typography color="text.secondary">No posts yet</Typography>
                    ) : (
                        userPosts.map((post) => (
                            <Card key={post._id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{post.title}</Typography>
                                    <Typography color="text.secondary">
                                        Event: {post.event?.title}
                                    </Typography>
                                    <Typography variant="body2">
                                        Applications: {post.applications?.length || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            )}

            {/* Dialogs */}
            {renderCreateDialog()}
            {renderViewDialog()}
            {renderApplicationDialog()}
        </Box>
    );
};

export default TeamRecruitmentSection;
