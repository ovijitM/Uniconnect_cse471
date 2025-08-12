import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';
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
import EventIcon from '@mui/icons-material/Event';

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

    useEffect(() => {
        fetchClubData();
        fetchClubEvents();
    }, [id]);

    const fetchClubData = async () => {
        try {
            const response = await axios.get(`/api/clubs/${id}`);
            setClub(response.data);
        } catch (error) {
            console.error('Error fetching club data:', error);
            setError(error.response?.data?.message || 'Failed to load club information');
        } finally {
            setLoading(false);
        }
    };

    const fetchClubEvents = async () => {
        try {
            const response = await axios.get(`/api/events/club/${id}`);
            setClubEvents(response.data.events || []);
        } catch (error) {
            console.error('Error fetching club events:', error);
        }
    };

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
                await axios.post(`/api/clubs/${id}/leave`);
            } else {
                await axios.post(`/api/clubs/${id}/join`);
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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
                                                    {event.description?.substring(0, 100)}...
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                                                    <Typography variant="body2">
                                                        {formatDate(event.startDate)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationOnIcon sx={{ fontSize: 16 }} />
                                                    <Typography variant="body2">
                                                        {event.venue}
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
        </Container>
    );
};

export default ClubProfile;
