import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Tabs,
    Tab,
    IconButton,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Switch,
    FormControlLabel,
    Badge,
    Menu,
    Autocomplete,
    Stack,
    LinearProgress
} from '@mui/material';
import {
    Send,
    Email,
    Sms,
    Campaign,
    Reply,
    Forward,
    MoreVert,
    Person,
    Group,
    Notifications,
    Chat,
    Inbox,
    Archive,
    Delete,
    Edit,
    Visibility,
    Search,
    Analytics
} from '@mui/icons-material';

const CommunicationTab = () => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [communicationData, setCommunicationData] = useState({
        messages: [
            {
                id: 1,
                type: 'Email',
                subject: 'Upcoming Workshop: React Best Practices',
                recipients: 145,
                status: 'Sent',
                sentDate: '2024-01-25',
                openRate: 78,
                clickRate: 12,
                sender: 'Event Coordinator',
                priority: 'High',
                category: 'Event Announcement'
            },
            {
                id: 2,
                type: 'SMS',
                subject: 'Reminder: Meeting Tomorrow at 3 PM',
                recipients: 25,
                status: 'Sent',
                sentDate: '2024-01-24',
                deliveryRate: 96,
                sender: 'Admin User',
                priority: 'Medium',
                category: 'Reminder'
            },
            {
                id: 3,
                type: 'Push Notification',
                subject: 'New Club Membership Applications',
                recipients: 89,
                status: 'Draft',
                createdDate: '2024-01-23',
                sender: 'Membership Manager',
                priority: 'Low',
                category: 'Membership'
            }
        ],
        campaigns: [
            {
                id: 1,
                name: 'Spring Semester Events',
                type: 'Email Campaign',
                status: 'Active',
                startDate: '2024-01-15',
                endDate: '2024-05-15',
                totalSent: 1250,
                openRate: 65,
                clickRate: 8,
                conversions: 45,
                budget: 500,
                spent: 120
            },
            {
                id: 2,
                name: 'Membership Drive 2024',
                type: 'Multi-Channel',
                status: 'Scheduled',
                startDate: '2024-02-01',
                endDate: '2024-03-01',
                totalSent: 0,
                openRate: 0,
                clickRate: 0,
                conversions: 0,
                budget: 800,
                spent: 0
            }
        ],
        conversations: [
            {
                id: 1,
                participant: 'Sarah Johnson',
                lastMessage: 'Thanks for the event details!',
                timestamp: '2024-01-25 14:30',
                unread: 2,
                type: 'Member',
                avatar: '/api/placeholder/40/40'
            },
            {
                id: 2,
                participant: 'Tech Committee',
                lastMessage: 'Meeting notes have been shared',
                timestamp: '2024-01-25 12:15',
                unread: 0,
                type: 'Group',
                avatar: '/api/placeholder/40/40'
            },
            {
                id: 3,
                participant: 'John Smith',
                lastMessage: 'Can we reschedule the interview?',
                timestamp: '2024-01-24 18:45',
                unread: 1,
                type: 'Applicant',
                avatar: '/api/placeholder/40/40'
            }
        ]
    });

    // Dialog states
    const [composeDialog, setComposeDialog] = useState(false);
    const [campaignDialog, setCampaignDialog] = useState(false);
    const [conversationDialog, setConversationDialog] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(null);

    // Form states
    const [newMessage, setNewMessage] = useState({
        type: 'Email',
        recipients: [],
        subject: '',
        content: '',
        priority: 'Medium',
        schedule: false,
        scheduledDate: '',
        template: ''
    });

    const [newCampaign, setNewCampaign] = useState({
        name: '',
        type: 'Email Campaign',
        startDate: '',
        endDate: '',
        budget: '',
        audience: [],
        content: ''
    });

    // Table and filter states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    // Menu states

    const handleSendMessage = () => {
        const messageData = {
            ...newMessage,
            id: Date.now(),
            status: newMessage.schedule ? 'Scheduled' : 'Sent',
            sentDate: newMessage.schedule ? newMessage.scheduledDate : new Date().toISOString().split('T')[0],
            sender: 'Current User',
            recipients: newMessage.recipients.length || 1,
            openRate: Math.floor(Math.random() * 100),
            clickRate: Math.floor(Math.random() * 20)
        };

        setCommunicationData(prev => ({
            ...prev,
            messages: [...prev.messages, messageData]
        }));

        setNewMessage({
            type: 'Email',
            recipients: [],
            subject: '',
            content: '',
            priority: 'Medium',
            schedule: false,
            scheduledDate: '',
            template: ''
        });
        setComposeDialog(false);
    };

    const handleCreateCampaign = () => {
        const campaignData = {
            ...newCampaign,
            id: Date.now(),
            status: 'Draft',
            totalSent: 0,
            openRate: 0,
            clickRate: 0,
            conversions: 0,
            spent: 0
        };

        setCommunicationData(prev => ({
            ...prev,
            campaigns: [...prev.campaigns, campaignData]
        }));

        setNewCampaign({
            name: '',
            type: 'Email Campaign',
            startDate: '',
            endDate: '',
            budget: '',
            audience: [],
            content: ''
        });
        setCampaignDialog(false);
    };

    const getFilteredData = () => {
        let data = [];
        if (tabValue === 0) data = communicationData.messages;
        else if (tabValue === 1) data = communicationData.campaigns;
        else return communicationData.conversations;

        if (searchQuery) {
            data = data.filter(item =>
                (item.subject || item.name)?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'All') {
            data = data.filter(item => item.status === statusFilter);
        }

        if (typeFilter !== 'All') {
            data = data.filter(item => item.type === typeFilter);
        }

        return data;
    };

    const MessagesList = () => {
        const filteredMessages = getFilteredData();
        const paginatedMessages = filteredMessages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return (
            <>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Message</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Recipients</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Performance</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedMessages.map((message) => (
                                <TableRow key={message.id} hover>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="medium">
                                                {message.subject}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                From: {message.sender}
                                            </Typography>
                                            <Box sx={{ mt: 0.5 }}>
                                                <Chip
                                                    label={message.priority}
                                                    size="small"
                                                    color={
                                                        message.priority === 'High' ? 'error' :
                                                            message.priority === 'Medium' ? 'warning' : 'default'
                                                    }
                                                />
                                                <Chip
                                                    label={message.category}
                                                    size="small"
                                                    sx={{ ml: 0.5 }}
                                                />
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {message.type === 'Email' && <Email sx={{ mr: 1, color: 'primary.main' }} />}
                                            {message.type === 'SMS' && <Sms sx={{ mr: 1, color: 'success.main' }} />}
                                            {message.type === 'Push Notification' && <Notifications sx={{ mr: 1, color: 'info.main' }} />}
                                            {message.type}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {message.recipients} recipients
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={message.status}
                                            size="small"
                                            color={
                                                message.status === 'Sent' ? 'success' :
                                                    message.status === 'Draft' ? 'default' :
                                                        message.status === 'Scheduled' ? 'info' : 'error'
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {message.status === 'Sent' && (
                                            <Box>
                                                <Typography variant="body2">
                                                    Open: {message.openRate}%
                                                </Typography>
                                                <Typography variant="body2">
                                                    Click: {message.clickRate}%
                                                </Typography>
                                            </Box>
                                        )}
                                        {message.status === 'Draft' && (
                                            <Typography variant="body2" color="text.secondary">
                                                Not sent yet
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(message.sentDate || message.createdDate).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                setAnchorEl(e.currentTarget);
                                                setSelectedMessage(message);
                                            }}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredMessages.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </>
        );
    };

    const CampaignsList = () => {
        const filteredCampaigns = getFilteredData();

        return (
            <Grid container spacing={3}>
                {filteredCampaigns.map((campaign) => (
                    <Grid item xs={12} md={6} lg={4} key={campaign.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                    <Typography variant="h6" component="h3">
                                        {campaign.name}
                                    </Typography>
                                    <Chip
                                        label={campaign.status}
                                        size="small"
                                        color={
                                            campaign.status === 'Active' ? 'success' :
                                                campaign.status === 'Scheduled' ? 'info' : 'default'
                                        }
                                    />
                                </Box>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {campaign.type}
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Period: {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                {campaign.status === 'Active' && (
                                    <>
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Sent
                                                </Typography>
                                                <Typography variant="h6">
                                                    {campaign.totalSent}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Open Rate
                                                </Typography>
                                                <Typography variant="h6">
                                                    {campaign.openRate}%
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Budget Usage
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(campaign.spent / campaign.budget) * 100}
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                ${campaign.spent} of ${campaign.budget}
                                            </Typography>
                                        </Box>
                                    </>
                                )}

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button size="small" startIcon={<Analytics />}>
                                        View Analytics
                                    </Button>
                                    <Button size="small" startIcon={<Edit />}>
                                        Edit
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    };

    const ConversationsList = () => (
        <List>
            {communicationData.conversations.map((conversation) => (
                <React.Fragment key={conversation.id}>
                    <ListItem
                        button
                        onClick={() => {
                            setSelectedConversation(conversation);
                            setConversationDialog(true);
                        }}
                    >
                        <ListItemAvatar>
                            <Badge badgeContent={conversation.unread} color="primary">
                                <Avatar src={conversation.avatar}>
                                    {conversation.type === 'Group' ? <Group /> : <Person />}
                                </Avatar>
                            </Badge>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" component="span">
                                        {conversation.participant}
                                    </Typography>
                                    <Chip
                                        label={conversation.type}
                                        size="small"
                                        sx={{ ml: 1 }}
                                    />
                                </Box>
                            }
                            secondary={
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {conversation.lastMessage}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {conversation.timestamp}
                                    </Typography>
                                </Box>
                            }
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end">
                                <Reply />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                </React.Fragment>
            ))}
        </List>
    );

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Communication Center
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<Campaign />}
                        onClick={() => setCampaignDialog(true)}
                    >
                        New Campaign
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Send />}
                        onClick={() => setComposeDialog(true)}
                    >
                        Compose Message
                    </Button>
                </Stack>
            </Box>

            {/* Communication Type Tabs */}
            <Card sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab icon={<Inbox />} label="Messages" />
                    <Tab icon={<Campaign />} label="Campaigns" />
                    <Tab icon={<Chat />} label="Conversations" />
                </Tabs>
            </Card>

            {/* Filters and Search */}
            {tabValue < 2 && (
                <Card sx={{ mb: 3, p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="All">All Status</MenuItem>
                                    <MenuItem value="Sent">Sent</MenuItem>
                                    <MenuItem value="Draft">Draft</MenuItem>
                                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                                    <MenuItem value="Active">Active</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    label="Type"
                                >
                                    <MenuItem value="All">All Types</MenuItem>
                                    <MenuItem value="Email">Email</MenuItem>
                                    <MenuItem value="SMS">SMS</MenuItem>
                                    <MenuItem value="Push Notification">Push Notification</MenuItem>
                                    <MenuItem value="Email Campaign">Email Campaign</MenuItem>
                                    <MenuItem value="Multi-Channel">Multi-Channel</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>
            )}

            {/* Content Area */}
            <Card>
                {tabValue === 0 && <MessagesList />}
                {tabValue === 1 && (
                    <CardContent>
                        <CampaignsList />
                    </CardContent>
                )}
                {tabValue === 2 && <ConversationsList />}
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <Visibility sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <Edit sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <Reply sx={{ mr: 1 }} />
                    Reply
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <Forward sx={{ mr: 1 }} />
                    Forward
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <Archive sx={{ mr: 1 }} />
                    Archive
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
                    <Delete sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Compose Message Dialog */}
            <Dialog
                open={composeDialog}
                onClose={() => setComposeDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Compose New Message</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Message Type</InputLabel>
                                    <Select
                                        value={newMessage.type}
                                        onChange={(e) => setNewMessage({ ...newMessage, type: e.target.value })}
                                        label="Message Type"
                                    >
                                        <MenuItem value="Email">Email</MenuItem>
                                        <MenuItem value="SMS">SMS</MenuItem>
                                        <MenuItem value="Push Notification">Push Notification</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        value={newMessage.priority}
                                        onChange={(e) => setNewMessage({ ...newMessage, priority: e.target.value })}
                                        label="Priority"
                                    >
                                        <MenuItem value="Low">Low</MenuItem>
                                        <MenuItem value="Medium">Medium</MenuItem>
                                        <MenuItem value="High">High</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Template</InputLabel>
                                    <Select
                                        value={newMessage.template}
                                        onChange={(e) => setNewMessage({ ...newMessage, template: e.target.value })}
                                        label="Template"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value="event-announcement">Event Announcement</MenuItem>
                                        <MenuItem value="reminder">Reminder</MenuItem>
                                        <MenuItem value="welcome">Welcome Message</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    options={['All Members', 'Active Members', 'Committee Members', 'New Members']}
                                    value={newMessage.recipients}
                                    onChange={(e, newValue) => setNewMessage({ ...newMessage, recipients: newValue })}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Recipients" placeholder="Select recipients..." />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Subject"
                                    value={newMessage.subject}
                                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Message Content"
                                    value={newMessage.content}
                                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                    multiline
                                    rows={6}
                                    placeholder="Enter your message content here..."
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={newMessage.schedule}
                                            onChange={(e) => setNewMessage({ ...newMessage, schedule: e.target.checked })}
                                        />
                                    }
                                    label="Schedule for later"
                                />
                                {newMessage.schedule && (
                                    <TextField
                                        type="datetime-local"
                                        label="Schedule Date & Time"
                                        value={newMessage.scheduledDate}
                                        onChange={(e) => setNewMessage({ ...newMessage, scheduledDate: e.target.value })}
                                        sx={{ ml: 2 }}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setComposeDialog(false)}>Cancel</Button>
                    <Button onClick={() => setComposeDialog(false)} variant="outlined">
                        Save Draft
                    </Button>
                    <Button onClick={handleSendMessage} variant="contained">
                        {newMessage.schedule ? 'Schedule' : 'Send'} Message
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Campaign Dialog */}
            <Dialog
                open={campaignDialog}
                onClose={() => setCampaignDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Campaign Name"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Campaign Type</InputLabel>
                                    <Select
                                        value={newCampaign.type}
                                        onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                                        label="Campaign Type"
                                    >
                                        <MenuItem value="Email Campaign">Email Campaign</MenuItem>
                                        <MenuItem value="SMS Campaign">SMS Campaign</MenuItem>
                                        <MenuItem value="Multi-Channel">Multi-Channel</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Start Date"
                                    value={newCampaign.startDate}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="End Date"
                                    value={newCampaign.endDate}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Budget ($)"
                                    value={newCampaign.budget}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    options={['All Members', 'Active Members', 'Inactive Members', 'Alumni', 'Prospects']}
                                    value={newCampaign.audience}
                                    onChange={(e, newValue) => setNewCampaign({ ...newCampaign, audience: newValue })}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Target Audience" placeholder="Select audience..." />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Campaign Content"
                                    value={newCampaign.content}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                                    multiline
                                    rows={4}
                                    placeholder="Enter campaign content or description..."
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCampaignDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateCampaign} variant="contained">
                        Create Campaign
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Conversation Dialog */}
            <Dialog
                open={conversationDialog}
                onClose={() => setConversationDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedConversation && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={selectedConversation.avatar} sx={{ mr: 2 }}>
                                {selectedConversation.type === 'Group' ? <Group /> : <Person />}
                            </Avatar>
                            <Box>
                                <Typography variant="h6">
                                    {selectedConversation.participant}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedConversation.type}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">
                            Conversation interface would be implemented here
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <TextField
                        fullWidth
                        placeholder="Type a message..."
                        sx={{ mr: 2 }}
                    />
                    <Button variant="contained" startIcon={<Send />}>
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommunicationTab;
