import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    Switch,
    FormControlLabel,
    Badge,
    Chip,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const NotificationsTab = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [createNotificationOpen, setCreateNotificationOpen] = useState(false);
    const [newNotification, setNewNotification] = useState({
        title: '',
        message: '',
        type: 'info',
        targetClubs: [],
        sendEmail: true,
        sendPush: true
    });

    // Internal notification preferences state
    const [notificationPreferences, setNotificationPreferences] = useState({
        email: true,
        push: true,
        sms: false,
        eventReminders: true,
        memberUpdates: true,
        systemAlerts: true,
        weeklyReports: false
    });

    // Sample notifications data
    const sampleNotifications = [
        {
            id: 1,
            title: 'New Member Joined Tech Club',
            message: 'John Doe has joined the Technology Club.',
            type: 'member',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            isRead: false,
            club: 'Technology Club'
        },
        {
            id: 2,
            title: 'Upcoming Event Reminder',
            message: 'Workshop on React Development starts in 2 hours.',
            type: 'event',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            isRead: false,
            club: 'Programming Club'
        },
        {
            id: 3,
            title: 'Event Registration Deadline',
            message: 'Registration for the Annual Conference closes tomorrow.',
            type: 'warning',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            isRead: true,
            club: 'Academic Club'
        },
        {
            id: 4,
            title: 'Club Achievement Unlocked',
            message: 'Photography Club reached 100 members!',
            type: 'success',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            isRead: true,
            club: 'Photography Club'
        },
        {
            id: 5,
            title: 'System Update',
            message: 'New features have been added to the dashboard.',
            type: 'info',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
            isRead: false,
            club: 'System'
        }
    ];

    const [currentNotifications, setCurrentNotifications] = useState(sampleNotifications);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'member': return <GroupIcon color="primary" />;
            case 'event': return <EventIcon color="secondary" />;
            case 'warning': return <WarningIcon color="warning" />;
            case 'success': return <CheckCircleIcon color="success" />;
            case 'info': return <InfoIcon color="info" />;
            default: return <NotificationsIcon />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'member': return 'primary';
            case 'event': return 'secondary';
            case 'warning': return 'warning';
            case 'success': return 'success';
            case 'info': return 'info';
            default: return 'default';
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        return `${days} days ago`;
    };

    const handleMarkAsRead = (notificationId) => {
        setCurrentNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId
                    ? { ...notif, isRead: true }
                    : notif
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setCurrentNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    };

    const handleDeleteNotification = (notificationId) => {
        setCurrentNotifications(prev =>
            prev.filter(notif => notif.id !== notificationId)
        );
    };

    const handlePreferenceChange = (preference) => (event) => {
        setNotificationPreferences(prev => ({
            ...prev,
            [preference]: event.target.checked
        }));
    };

    const handleCreateNotification = () => {
        const notification = {
            ...newNotification,
            id: Date.now(),
            timestamp: new Date(),
            isRead: false,
            club: 'Admin'
        };

        setCurrentNotifications(prev => [notification, ...prev]);
        setNewNotification({
            title: '',
            message: '',
            type: 'info',
            targetClubs: [],
            sendEmail: true,
            sendPush: true
        });
        setCreateNotificationOpen(false);
    };

    const unreadCount = currentNotifications.filter(n => !n.isRead).length;

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h5">Notifications</Typography>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </Box>
                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateNotificationOpen(true)}
                    >
                        Create Notification
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<MarkEmailReadIcon />}
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        Mark All Read
                    </Button>
                    <Tooltip title="Notification Settings">
                        <IconButton onClick={() => setSettingsOpen(true)}>
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Notification Statistics */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                                {unreadCount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Unread Notifications
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="secondary" fontWeight="bold">
                                {currentNotifications.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Notifications
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main" fontWeight="bold">
                                {currentNotifications.filter(n => n.type === 'event').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Event Notifications
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="warning.main" fontWeight="bold">
                                {currentNotifications.filter(n => n.type === 'warning').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Important Alerts
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Notifications List */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Recent Notifications
                    </Typography>
                    {currentNotifications.length === 0 ? (
                        <Alert severity="info">
                            No notifications at this time.
                        </Alert>
                    ) : (
                        <List>
                            {currentNotifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <ListItem
                                        sx={{
                                            bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                                            borderRadius: 1,
                                            mb: 1
                                        }}
                                    >
                                        <ListItemIcon>
                                            {getNotificationIcon(notification.type)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={notification.isRead ? 'normal' : 'bold'}
                                                    >
                                                        {notification.title}
                                                    </Typography>
                                                    <Chip
                                                        label={notification.club}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={notification.type}
                                                        size="small"
                                                        color={getNotificationColor(notification.type)}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {notification.message}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatTimestamp(notification.timestamp)}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Box display="flex" gap={1}>
                                                {!notification.isRead && (
                                                    <Tooltip title="Mark as Read">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                        >
                                                            <MarkEmailReadIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteNotification(notification.id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < currentNotifications.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            {/* Notification Settings Dialog */}
            <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Notification Preferences</DialogTitle>
                <DialogContent>
                    <Box py={2}>
                        <Typography variant="subtitle1" gutterBottom>
                            Delivery Methods
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notificationPreferences.email}
                                    onChange={handlePreferenceChange('email')}
                                />
                            }
                            label="Email Notifications"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notificationPreferences.push}
                                    onChange={handlePreferenceChange('push')}
                                />
                            }
                            label="Push Notifications"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notificationPreferences.sms}
                                    onChange={handlePreferenceChange('sms')}
                                />
                            }
                            label="SMS Notifications"
                        />

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle1" gutterBottom>
                            Notification Types
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notificationPreferences.eventReminders}
                                    onChange={handlePreferenceChange('eventReminders')}
                                />
                            }
                            label="Event Reminders"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notificationPreferences.memberUpdates}
                                    onChange={handlePreferenceChange('memberUpdates')}
                                />
                            }
                            label="Member Updates"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notificationPreferences.systemAlerts}
                                    onChange={handlePreferenceChange('systemAlerts')}
                                />
                            }
                            label="System Alerts"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notificationPreferences.weeklyReports}
                                    onChange={handlePreferenceChange('weeklyReports')}
                                />
                            }
                            label="Weekly Reports"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => setSettingsOpen(false)}>
                        Save Preferences
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Notification Dialog */}
            <Dialog open={createNotificationOpen} onClose={() => setCreateNotificationOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogContent>
                    <Box py={2} display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={newNotification.title}
                            onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <TextField
                            label="Message"
                            fullWidth
                            multiline
                            rows={3}
                            value={newNotification.message}
                            onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={newNotification.type}
                                label="Type"
                                onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
                            >
                                <MenuItem value="info">Information</MenuItem>
                                <MenuItem value="warning">Warning</MenuItem>
                                <MenuItem value="success">Success</MenuItem>
                                <MenuItem value="event">Event</MenuItem>
                                <MenuItem value="member">Member</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newNotification.sendEmail}
                                    onChange={(e) => setNewNotification(prev => ({ ...prev, sendEmail: e.target.checked }))}
                                />
                            }
                            label="Send Email"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newNotification.sendPush}
                                    onChange={(e) => setNewNotification(prev => ({ ...prev, sendPush: e.target.checked }))}
                                />
                            }
                            label="Send Push Notification"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateNotificationOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateNotification}
                        disabled={!newNotification.title || !newNotification.message}
                    >
                        Send Notification
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NotificationsTab;
