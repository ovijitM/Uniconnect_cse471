import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Grid,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    LinearProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AccessTime as AccessTimeIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const ClubRequestsTab = ({ user, token }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Form state for new club request
    const [requestForm, setRequestForm] = useState({
        name: '',
        description: '',
        category: 'Academic',
        contactEmail: '',
        membershipFee: 0
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const categories = [
        'Academic', 'Sports', 'Cultural', 'Technical', 'Social', 'Professional',
        'Arts', 'Environment', 'Community Service', 'Other'
    ];

    const statusConfig = {
        pending: {
            color: 'warning',
            icon: <PendingIcon />,
            label: 'Pending Review',
            description: 'Your request is waiting for administrator approval'
        },
        approved: {
            color: 'success',
            icon: <CheckCircleIcon />,
            label: 'Approved',
            description: 'Your club has been approved and created'
        },
        rejected: {
            color: 'error',
            icon: <CancelIcon />,
            label: 'Rejected',
            description: 'Your request was not approved'
        }
    };

    useEffect(() => {
        fetchClubRequests();
    }, []);

    const fetchClubRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/club-requests', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (response.ok) {
                setRequests(data.requests || []);
            } else {
                console.error('Error fetching club requests:', data.message);
            }
        } catch (error) {
            console.error('Error fetching club requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!requestForm.name?.trim()) {
            errors.name = 'Club name is required';
        }

        if (!requestForm.description?.trim()) {
            errors.description = 'Club description is required';
        }

        if (!requestForm.contactEmail?.trim()) {
            errors.contactEmail = 'Contact email is required';
        } else if (!/\S+@\S+\.\S+/.test(requestForm.contactEmail)) {
            errors.contactEmail = 'Please enter a valid email address';
        }

        if (requestForm.membershipFee < 0) {
            errors.membershipFee = 'Membership fee cannot be negative';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateRequest = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const response = await fetch('/api/club-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestForm)
            });

            const data = await response.json();

            if (response.ok) {
                setCreateDialogOpen(false);
                setRequestForm({
                    name: '',
                    description: '',
                    category: 'Academic',
                    contactEmail: '',
                    membershipFee: 0
                });
                setFormErrors({});
                await fetchClubRequests();
                alert('Club request submitted successfully!');
            } else {
                alert(data.message || 'Failed to submit club request');
            }
        } catch (error) {
            console.error('Error creating club request:', error);
            alert('Failed to submit club request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewRequest = (request) => {
        setSelectedRequest(request);
        setViewDialogOpen(true);
    };

    const handleFormChange = (field, value) => {
        setRequestForm(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const canCreateNewRequest = () => {
        return !requests.some(request => request.status === 'pending');
    };

    const renderRequestCard = (request) => {
        const status = statusConfig[request.status];

        return (
            <Card key={request._id} sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3">
                            {request.name}
                        </Typography>
                        <Chip
                            icon={status.icon}
                            label={status.label}
                            color={status.color}
                            size="small"
                        />
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                        {request.description?.substring(0, 150)}
                        {request.description?.length > 150 && '...'}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                                Category
                            </Typography>
                            <Typography variant="body2">
                                {request.category}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                                Membership Fee
                            </Typography>
                            <Typography variant="body2">
                                ${request.membershipFee || 0}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="caption">
                            Submitted {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                        </Typography>
                    </Box>

                    {request.reviewedAt && (
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                            <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="caption">
                                Reviewed {format(new Date(request.reviewedAt), 'MMM dd, yyyy')}
                                {request.reviewedBy?.name && ` by ${request.reviewedBy.name}`}
                            </Typography>
                        </Box>
                    )}

                    {request.adminNotes && (
                        <Alert severity={request.status === 'rejected' ? 'error' : 'info'} sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                <strong>Administrator Notes:</strong> {request.adminNotes}
                            </Typography>
                        </Alert>
                    )}
                </CardContent>

                <CardActions>
                    <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewRequest(request)}
                    >
                        View Details
                    </Button>

                    {request.status === 'approved' && request.clubId && (
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => window.location.href = `/clubs/${request.clubId._id}`}
                        >
                            View Club
                        </Button>
                    )}
                </CardActions>
            </Card>
        );
    };

    const renderCreateDialog = () => (
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Submit Club Creation Request</DialogTitle>
            <DialogContent>
                <Alert severity="info" sx={{ mb: 3 }}>
                    Your club request will be reviewed by administrators. Once approved, your club will be created and you'll be assigned as the president.
                </Alert>

                <TextField
                    fullWidth
                    label="Club Name"
                    value={requestForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    sx={{ mb: 2 }}
                    required
                />

                <TextField
                    fullWidth
                    label="Club Description"
                    multiline
                    rows={4}
                    value={requestForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                    sx={{ mb: 2 }}
                    required
                />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={requestForm.category}
                                onChange={(e) => handleFormChange('category', e.target.value)}
                                label="Category"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Membership Fee ($)"
                            type="number"
                            value={requestForm.membershipFee}
                            onChange={(e) => handleFormChange('membershipFee', Number(e.target.value))}
                            error={!!formErrors.membershipFee}
                            helperText={formErrors.membershipFee}
                            inputProps={{ min: 0, step: 1 }}
                        />
                    </Grid>
                </Grid>

                <TextField
                    fullWidth
                    label="Contact Email"
                    type="email"
                    value={requestForm.contactEmail}
                    onChange={(e) => handleFormChange('contactEmail', e.target.value)}
                    error={!!formErrors.contactEmail}
                    helperText={formErrors.contactEmail}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleCreateRequest}
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
            </DialogActions>
        </Dialog>
    );

    const renderViewDialog = () => (
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
            {selectedRequest && (
                <>
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {selectedRequest.name}
                            <Chip
                                icon={statusConfig[selectedRequest.status].icon}
                                label={statusConfig[selectedRequest.status].label}
                                color={statusConfig[selectedRequest.status].color}
                            />
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" paragraph>
                            {selectedRequest.description}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" gutterBottom>Category</Typography>
                                <Typography variant="body2">{selectedRequest.category}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" gutterBottom>Membership Fee</Typography>
                                <Typography variant="body2">${selectedRequest.membershipFee || 0}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" gutterBottom>Contact Email</Typography>
                                <Typography variant="body2">{selectedRequest.contactEmail}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" gutterBottom>University</Typography>
                                <Typography variant="body2">{selectedRequest.university?.name}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" gutterBottom>Request Timeline</Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Request Submitted"
                                    secondary={format(new Date(selectedRequest.createdAt), 'PPpp')}
                                />
                            </ListItem>
                            {selectedRequest.reviewedAt && (
                                <ListItem>
                                    <ListItemText
                                        primary={`Request ${selectedRequest.status === 'approved' ? 'Approved' : 'Rejected'}`}
                                        secondary={`${format(new Date(selectedRequest.reviewedAt), 'PPpp')} by ${selectedRequest.reviewedBy?.name || 'Administrator'}`}
                                    />
                                </ListItem>
                            )}
                            {selectedRequest.status === 'approved' && selectedRequest.clubId && (
                                <ListItem>
                                    <ListItemText
                                        primary="Club Created"
                                        secondary="Your club is now active and visible to students"
                                    />
                                </ListItem>
                            )}
                        </List>

                        {selectedRequest.adminNotes && (
                            <Alert severity={selectedRequest.status === 'rejected' ? 'error' : 'info'} sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>Administrator Notes</Typography>
                                <Typography variant="body2">{selectedRequest.adminNotes}</Typography>
                            </Alert>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                        {selectedRequest.status === 'approved' && selectedRequest.clubId && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setViewDialogOpen(false);
                                    window.location.href = `/clubs/${selectedRequest.clubId._id}`;
                                }}
                            >
                                Go to Club
                            </Button>
                        )}
                    </DialogActions>
                </>
            )}
        </Dialog>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Club Requests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Submit and track your club creation requests
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateDialogOpen(true)}
                    disabled={!canCreateNewRequest()}
                >
                    New Request
                </Button>
            </Box>

            {!canCreateNewRequest() && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You have a pending club request. Please wait for it to be reviewed before submitting a new one.
                </Alert>
            )}

            {requests.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            No club requests yet
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                            Submit your first club creation request to get started
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            Submit First Request
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Box>
                    {requests.map(renderRequestCard)}
                </Box>
            )}

            {renderCreateDialog()}
            {renderViewDialog()}
        </Box>
    );
};

export default ClubRequestsTab;
