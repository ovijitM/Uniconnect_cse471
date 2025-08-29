import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';
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
    IconButton,
    Link,
    Paper,
    Tab,
    Tabs,
    CircularProgress,
    Alert
} from '@mui/material';
import { useAuth } from '../features/auth/context/AuthContext';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import PushPinIcon from '@mui/icons-material/PushPin';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';

const ClubProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [club, setClub] = useState(null);
    const [clubEvents, setClubEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [joinLoading, setJoinLoading] = useState(false);

    // Announcement states
    const [announcements, setAnnouncements] = useState([]);
    const [announcementsLoading, setAnnouncementsLoading] = useState(false);
    const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
    const [newAnnouncementData, setNewAnnouncementData] = useState({
        title: '',
        content: '',
        type: 'General',
        priority: 'Normal',
        isPinned: false
    });
    const [commentDialogs, setCommentDialogs] = useState({});
    const [newCommentContent, setNewCommentContent] = useState({});

    const fetchClubData = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/clubs/${id}`);
            setClub(response.data);
        } catch (error) {
            console.error('Error fetching club data:', error);
            setError(error.response?.data?.message || 'Failed to load club information');
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchClubEvents = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/events/club/${id}`);
            setClubEvents(response.data.events || []);
        } catch (error) {
            console.error('Error fetching club events:', error);
        }
    }, [id]);

    const isUserMember = () => {
        return club?.members?.some(member => member.user._id === user?._id);
    };

    const isUserPresident = () => {
        return club?.president?._id === user?._id;
    };

    const handleJoinLeave = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setJoinLoading(true);
        try {
            if (isUserMember()) {
                await axios.post(`${API_BASE_URL}/clubs/${id}/leave`);
            } else {
                await axios.post(`${API_BASE_URL}/clubs/${id}/join`);
            }
            await fetchClubData(); // Refresh club data
        } catch (error) {
            console.error('Error joining/leaving club:', error);
            alert(error.response?.data?.message || 'Operation failed');
        } finally {
            setJoinLoading(false);
        }
    };

    const handleEventClick = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    // Announcement functions
    const fetchAnnouncements = useCallback(async () => {
        setAnnouncementsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/announcements/club/${id}`);
            setAnnouncements(response.data.announcements || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setAnnouncementsLoading(false);
        }
    }, [id]);

    const canCreateAnnouncement = () => {
        if (!user || !club) return false;

        // System administrator can create announcements for any club
        if (user.role === 'Administrator') {
            return true;
        }

        // Club president (from club model) can create announcements
        if (club.president && club.president._id === user._id) {
            return true;
        }

        // Check if user is an officer or above in the club members
        const userMembership = club.members?.find(member =>
            member.user._id === user._id
        );

        if (userMembership && ['President', 'Vice President', 'Officer', 'Secretary'].includes(userMembership.role)) {
            return true;
        }

        // Club Admin role can only create announcements if they are the president of this specific club
        if (user.role === 'Club Admin' && club.president && club.president._id === user._id) {
            return true;
        }

        return false;
    };

    const handleCreateAnnouncement = async () => {
        if (!newAnnouncementData.title.trim() || !newAnnouncementData.content.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/announcements/club/${id}`, newAnnouncementData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAnnouncementDialogOpen(false);
            setNewAnnouncementData({
                title: '',
                content: '',
                type: 'General',
                priority: 'Normal',
                isPinned: false
            });
            fetchAnnouncements();
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert(error.response?.data?.message || 'Failed to create announcement');
        }
    };

    const handleLikeAnnouncement = async (announcementId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/announcements/${announcementId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the announcement in the list
            setAnnouncements(prev => prev.map(announcement =>
                announcement._id === announcementId
                    ? {
                        ...announcement,
                        likeCount: response.data.likeCount,
                        isLikedByUser: response.data.isLiked
                    }
                    : announcement
            ));
        } catch (error) {
            console.error('Error liking announcement:', error);
        }
    };

    const handleAddComment = async (announcementId) => {
        const content = newCommentContent[announcementId];
        if (!content?.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/announcements/${announcementId}/comment`,
                { content: content.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update the announcement with the new comment
            setAnnouncements(prev => prev.map(announcement =>
                announcement._id === announcementId
                    ? {
                        ...announcement,
                        comments: [...announcement.comments, response.data.comment]
                    }
                    : announcement
            ));

            setNewCommentContent(prev => ({ ...prev, [announcementId]: '' }));
        } catch (error) {
            console.error('Error adding comment:', error);
            alert(error.response?.data?.message || 'Failed to add comment');
        }
    };

    const toggleCommentDialog = (announcementId) => {
        setCommentDialogs(prev => ({
            ...prev,
            [announcementId]: !prev[announcementId]
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        fetchClubData();
        if (tabValue === 2) { // Events tab
            fetchClubEvents();
        }
        if (tabValue === 4) { // Announcements tab
            fetchAnnouncements();
        }
    }, [id, tabValue, fetchClubData, fetchClubEvents, fetchAnnouncements]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, mt: 8, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !club) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
                <Alert severity="error">
                    {error || 'Club not found'}
                </Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/clubs')}
                    sx={{ mt: 2 }}
                >
                    Back to Clubs
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/clubs')}
                    sx={{ mb: 2 }}
                >
                    Back to Clubs
                </Button>

                <Paper sx={{ p: 4, mb: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: 'primary.main',
                                    fontSize: '2.5rem'
                                }}
                                src={club.logo}
                            >
                                {club.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h3" gutterBottom>
                                {club.name}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                <Chip
                                    icon={<SchoolIcon />}
                                    label={club.university?.name}
                                    color="primary"
                                />
                                <Chip
                                    label={club.category}
                                    color="secondary"
                                />
                                <Chip
                                    icon={<GroupsIcon />}
                                    label={`${club.members?.length || 0} Members`}
                                    variant="outlined"
                                />
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                {club.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                Founded: {formatDate(club.founded || club.createdAt)}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <CardActions>
                                {user && !isUserPresident() && (
                                    <Button
                                        variant={isUserMember() ? "outlined" : "contained"}
                                        size="large"
                                        startIcon={isUserMember() ? <PersonRemoveIcon /> : <PersonAddIcon />}
                                        onClick={handleJoinLeave}
                                        disabled={joinLoading}
                                        sx={{
                                            minWidth: 140,
                                            background: !isUserMember() ?
                                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined
                                        }}
                                    >
                                        {joinLoading ? <CircularProgress size={20} /> :
                                            isUserMember() ? 'Leave Club' : 'Join Club'}
                                    </Button>
                                )}
                                {isUserPresident() && (
                                    <Chip
                                        label="President"
                                        color="success"
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
                >
                    <Tab label="About" />
                    <Tab label="Members" />
                    <Tab label="Events" />
                    <Tab label="Contact" />
                    <Tab
                        label="Announcements"
                        icon={<CampaignIcon />}
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            {tabValue === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    About the Club
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {club.description}
                                </Typography>

                                {club.meetingSchedule && (
                                    <>
                                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                            Meeting Schedule
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Day:</strong> {club.meetingSchedule.day || 'TBD'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Time:</strong> {club.meetingSchedule.time || 'TBD'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Location:</strong> {club.meetingSchedule.location || 'TBD'}
                                        </Typography>
                                    </>
                                )}

                                {club.advisors && club.advisors.length > 0 && (
                                    <>
                                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                            Faculty Advisors
                                        </Typography>
                                        {club.advisors.map((advisor, index) => (
                                            <Typography key={index} variant="body2">
                                                {advisor}
                                            </Typography>
                                        ))}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Club Information
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemText
                                            primary="Category"
                                            secondary={club.category}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="University"
                                            secondary={club.university?.name}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Members"
                                            secondary={club.members?.length || 0}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Founded"
                                            secondary={formatDate(club.founded || club.createdAt)}
                                        />
                                    </ListItem>
                                    {club.membershipFee > 0 && (
                                        <ListItem>
                                            <ListItemText
                                                primary="Membership Fee"
                                                secondary={`$${club.membershipFee}`}
                                            />
                                        </ListItem>
                                    )}
                                </List>

                                {/* Social Media Links */}
                                {club.socialMedia && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Social Media
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {club.socialMedia.facebook && (
                                                <IconButton
                                                    component={Link}
                                                    href={club.socialMedia.facebook}
                                                    target="_blank"
                                                    color="primary"
                                                >
                                                    <FacebookIcon />
                                                </IconButton>
                                            )}
                                            {club.socialMedia.instagram && (
                                                <IconButton
                                                    component={Link}
                                                    href={club.socialMedia.instagram}
                                                    target="_blank"
                                                    color="primary"
                                                >
                                                    <InstagramIcon />
                                                </IconButton>
                                            )}
                                            {club.socialMedia.twitter && (
                                                <IconButton
                                                    component={Link}
                                                    href={club.socialMedia.twitter}
                                                    target="_blank"
                                                    color="primary"
                                                >
                                                    <TwitterIcon />
                                                </IconButton>
                                            )}
                                            {club.socialMedia.linkedin && (
                                                <IconButton
                                                    component={Link}
                                                    href={club.socialMedia.linkedin}
                                                    target="_blank"
                                                    color="primary"
                                                >
                                                    <LinkedInIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {tabValue === 1 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Club Members ({club.members?.length || 0})
                        </Typography>
                        <List>
                            {club.members?.map((member, index) => (
                                <React.Fragment key={member.user._id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar
                                                src={member.user.profilePicture}
                                                sx={{ bgcolor: 'primary.main' }}
                                            >
                                                {member.user.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={member.user.name}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" component="span">
                                                        {member.user.email}
                                                    </Typography>
                                                    {member.user.major && (
                                                        <Typography variant="body2" component="div">
                                                            {member.user.major} • {member.user.year}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                        <Chip
                                            label={member.role || 'Member'}
                                            size="small"
                                            color={member.role === 'President' ? 'primary' : 'default'}
                                        />
                                    </ListItem>
                                    {index < club.members.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}

            {tabValue === 2 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Upcoming Events ({clubEvents.length})
                        </Typography>
                        {clubEvents.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No upcoming events scheduled.
                            </Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {clubEvents.map((event) => (
                                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                                '&:hover': { transform: 'scale(1.02)' }
                                            }}
                                            onClick={() => handleEventClick(event._id)}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" noWrap>
                                                    {event.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    {event.description ? event.description.substring(0, 100) + '...' : 'No description available'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                                                    <Typography variant="body2">
                                                        {event.startDate ? formatDate(event.startDate) : 'Date TBD'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationOnIcon sx={{ fontSize: 16 }} />
                                                    <Typography variant="body2">
                                                        {event.venue || 'Venue TBD'}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
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
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <EmailIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Contact Email"
                                    secondary={club.contactEmail || 'Not provided'}
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                        <GroupsIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="President"
                                    secondary={club.president?.name || 'Not assigned'}
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            )}

            {/* Announcements Tab */}
            {tabValue === 4 && (
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                📢 Announcements
                            </Typography>
                            {canCreateAnnouncement() && (
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setAnnouncementDialogOpen(true)}
                                >
                                    Create Announcement
                                </Button>
                            )}
                        </Box>

                        {announcementsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : announcements.length === 0 ? (
                            <Alert severity="info">
                                No announcements yet. {canCreateAnnouncement() && "Create the first announcement!"}
                            </Alert>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {announcements.map((announcement) => (
                                    <Card
                                        key={announcement._id}
                                        variant="outlined"
                                        sx={{
                                            borderLeft: announcement.isPinned ? '4px solid #1976d2' : 'none',
                                            backgroundColor: announcement.isPinned ? 'rgba(25, 118, 210, 0.04)' : 'inherit'
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        {announcement.isPinned && <PushPinIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
                                                        <Typography variant="h6" component="h3">
                                                            {announcement.title}
                                                        </Typography>
                                                        <Chip
                                                            label={announcement.type}
                                                            size="small"
                                                            color={
                                                                announcement.priority === 'Urgent' ? 'error' :
                                                                    announcement.priority === 'High' ? 'warning' :
                                                                        announcement.priority === 'Normal' ? 'primary' : 'default'
                                                            }
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                        <Avatar sx={{ width: 24, height: 24 }}>
                                                            {announcement.author?.name?.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {announcement.author?.name} • {formatDate(announcement.createdAt)}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <VisibilityIcon sx={{ fontSize: 16 }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {announcement.views}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                                                {announcement.content}
                                            </Typography>

                                            {announcement.tags && announcement.tags.length > 0 && (
                                                <Box sx={{ mb: 2 }}>
                                                    {announcement.tags.map((tag, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={`#${tag}`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ mr: 0.5 }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        </CardContent>

                                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    startIcon={announcement.isLikedByUser ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                                                    onClick={() => handleLikeAnnouncement(announcement._id)}
                                                    disabled={!user}
                                                    color={announcement.isLikedByUser ? 'primary' : 'inherit'}
                                                >
                                                    {announcement.likeCount || 0}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<CommentIcon />}
                                                    onClick={() => toggleCommentDialog(announcement._id)}
                                                >
                                                    {announcement.comments?.length || 0}
                                                </Button>
                                            </Box>
                                        </CardActions>

                                        {/* Comments Section */}
                                        <Collapse in={commentDialogs[announcement._id]} timeout="auto" unmountOnExit>
                                            <Box sx={{ px: 2, pb: 2 }}>
                                                <Divider sx={{ mb: 2 }} />

                                                {/* Add Comment */}
                                                {user && (
                                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Add a comment..."
                                                            value={newCommentContent[announcement._id] || ''}
                                                            onChange={(e) => setNewCommentContent(prev => ({
                                                                ...prev,
                                                                [announcement._id]: e.target.value
                                                            }))}
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    handleAddComment(announcement._id);
                                                                }
                                                            }}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleAddComment(announcement._id)}
                                                            disabled={!newCommentContent[announcement._id]?.trim()}
                                                        >
                                                            <SendIcon fontSize="small" />
                                                        </Button>
                                                    </Box>
                                                )}

                                                {/* Comments List */}
                                                {announcement.comments && announcement.comments.length > 0 && (
                                                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                                        {announcement.comments.map((comment, index) => (
                                                            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                                <Avatar sx={{ width: 24, height: 24 }}>
                                                                    {comment.author?.name?.charAt(0)}
                                                                </Avatar>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {comment.author?.name} • {formatDate(comment.createdAt)}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        {comment.content}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Collapse>
                                    </Card>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Create Announcement Dialog */}
            <Dialog open={announcementDialogOpen} onClose={() => setAnnouncementDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={newAnnouncementData.title}
                            onChange={(e) => setNewAnnouncementData(prev => ({ ...prev, title: e.target.value }))}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Content"
                            multiline
                            rows={4}
                            value={newAnnouncementData.content}
                            onChange={(e) => setNewAnnouncementData(prev => ({ ...prev, content: e.target.value }))}
                            required
                        />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={newAnnouncementData.type}
                                        onChange={(e) => setNewAnnouncementData(prev => ({ ...prev, type: e.target.value }))}
                                        label="Type"
                                    >
                                        <MenuItem value="General">General</MenuItem>
                                        <MenuItem value="Event">Event</MenuItem>
                                        <MenuItem value="Important">Important</MenuItem>
                                        <MenuItem value="Urgent">Urgent</MenuItem>
                                        <MenuItem value="Achievement">Achievement</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        value={newAnnouncementData.priority}
                                        onChange={(e) => setNewAnnouncementData(prev => ({ ...prev, priority: e.target.value }))}
                                        label="Priority"
                                    >
                                        <MenuItem value="Low">Low</MenuItem>
                                        <MenuItem value="Normal">Normal</MenuItem>
                                        <MenuItem value="High">High</MenuItem>
                                        <MenuItem value="Urgent">Urgent</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                    <Button
                                        variant={newAnnouncementData.isPinned ? "contained" : "outlined"}
                                        startIcon={<PushPinIcon />}
                                        onClick={() => setNewAnnouncementData(prev => ({
                                            ...prev,
                                            isPinned: !prev.isPinned
                                        }))}
                                        fullWidth
                                    >
                                        {newAnnouncementData.isPinned ? 'Pinned' : 'Pin'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAnnouncementDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateAnnouncement} variant="contained">
                        Create Announcement
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ClubProfile;
