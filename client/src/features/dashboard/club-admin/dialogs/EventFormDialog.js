import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Grid,
    Box,
    Typography,
    Chip,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EventFormDialog = ({
    open,
    onClose,
    eventFormData,
    setEventFormData,
    formErrors,
    submitLoading,
    editMode,
    myClubs,
    onSubmit
}) => {
    const handleInputChange = (field) => (event) => {
        setEventFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSwitchChange = (field) => (event) => {
        setEventFormData(prev => ({
            ...prev,
            [field]: event.target.checked
        }));
    };

    const handleTagAdd = (tag) => {
        if (tag.trim() && !eventFormData.tags.includes(tag.trim())) {
            setEventFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag.trim()]
            }));
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setEventFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const eventCategories = [
        'Workshop', 'Seminar', 'Conference', 'Competition', 'Social',
        'Sports', 'Cultural', 'Academic', 'Networking', 'Fundraiser',
        'Community Service', 'Training', 'Meeting', 'Celebration'
    ];

    // Set default values for required registration fields
    React.useEffect(() => {
        if (!editMode && !eventFormData.isRegistrationRequired) {
            setEventFormData(prev => ({
                ...prev,
                isRegistrationRequired: true,
                registrationDeadline: prev.startDate || '',
                maxAttendees: prev.maxAttendees || 50
            }));
        }
    }, [editMode, eventFormData.isRegistrationRequired]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        {editMode ? 'Edit Event' : 'Create New Event'}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            label="Event Title"
                            fullWidth
                            value={eventFormData.title}
                            onChange={handleInputChange('title')}
                            error={!!formErrors.title}
                            helperText={formErrors.title}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            value={eventFormData.description}
                            onChange={handleInputChange('description')}
                            error={!!formErrors.description}
                            helperText={formErrors.description}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Date"
                            type="date"
                            fullWidth
                            value={eventFormData.date}
                            onChange={handleInputChange('date')}
                            error={!!formErrors.date}
                            helperText={formErrors.date}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Start Time"
                            type="time"
                            fullWidth
                            value={eventFormData.time}
                            onChange={handleInputChange('time')}
                            error={!!formErrors.time}
                            helperText={formErrors.time}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="End Time"
                            type="time"
                            fullWidth
                            value={eventFormData.endTime}
                            onChange={handleInputChange('endTime')}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={eventFormData.category}
                                label="Category"
                                onChange={handleInputChange('category')}
                            >
                                {eventCategories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Max Attendees"
                            type="number"
                            fullWidth
                            value={eventFormData.maxAttendees}
                            onChange={handleInputChange('maxAttendees')}
                            error={!!formErrors.maxAttendees}
                            helperText={formErrors.maxAttendees}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={eventFormData.isVirtual}
                                    onChange={handleSwitchChange('isVirtual')}
                                />
                            }
                            label="Virtual Event"
                        />
                    </Grid>

                    {eventFormData.isVirtual ? (
                        <Grid item xs={12}>
                            <TextField
                                label="Virtual Link"
                                fullWidth
                                value={eventFormData.virtualLink}
                                onChange={handleInputChange('virtualLink')}
                                error={!!formErrors.virtualLink}
                                helperText={formErrors.virtualLink}
                                placeholder="https://zoom.us/j/..."
                            />
                        </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <TextField
                                label="Location"
                                fullWidth
                                value={eventFormData.location}
                                onChange={handleInputChange('location')}
                                error={!!formErrors.location}
                                helperText={formErrors.location}
                                required
                            />
                        </Grid>
                    )}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Registration Deadline"
                            type="datetime-local"
                            fullWidth
                            value={eventFormData.registrationDeadline}
                            onChange={handleInputChange('registrationDeadline')}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Price (Optional)"
                            type="number"
                            fullWidth
                            value={eventFormData.price}
                            onChange={handleInputChange('price')}
                            InputProps={{ startAdornment: '$' }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Requirements"
                            fullWidth
                            multiline
                            rows={2}
                            value={eventFormData.requirements}
                            onChange={handleInputChange('requirements')}
                            placeholder="Any special requirements or prerequisites..."
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={eventFormData.isPrivate}
                                    onChange={handleSwitchChange('isPrivate')}
                                />
                            }
                            label="Private Event"
                        />
                    </Grid>

                    {/* Tags */}
                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Tags</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                            {eventFormData.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleTagRemove(tag)}
                                    size="small"
                                />
                            ))}
                        </Box>
                        <TextField
                            placeholder="Add tags (press Enter)"
                            fullWidth
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleTagAdd(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={submitLoading}
                >
                    {submitLoading ? 'Saving...' : (editMode ? 'Update' : 'Create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EventFormDialog;
