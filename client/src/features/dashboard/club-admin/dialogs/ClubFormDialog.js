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

const ClubFormDialog = ({
    open,
    onClose,
    clubFormData,
    setClubFormData,
    formErrors,
    submitLoading,
    editMode,
    universities,
    onSubmit
}) => {
    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setClubFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setClubFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSwitchChange = (field) => (event) => {
        setClubFormData(prev => ({
            ...prev,
            [field]: event.target.checked
        }));
    };

    const handleTagAdd = (tag) => {
        const currentTags = clubFormData.tags || [];
        if (tag.trim() && !currentTags.includes(tag.trim())) {
            setClubFormData(prev => ({
                ...prev,
                tags: [...currentTags, tag.trim()]
            }));
        }
    };

    const handleTagRemove = (tagToRemove) => {
        const currentTags = clubFormData.tags || [];
        setClubFormData(prev => ({
            ...prev,
            tags: currentTags.filter(tag => tag !== tagToRemove)
        }));
    };

    const clubCategories = [
        'Academic', 'Sports', 'Cultural', 'Technology', 'Community Service',
        'Professional', 'Arts', 'Music', 'Drama', 'Photography',
        'Literature', 'Science', 'Business', 'Environmental', 'Social'
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {!universities ? (
                <DialogContent>
                    <Typography>Loading...</Typography>
                </DialogContent>
            ) : (
                <>
                    <DialogTitle>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">
                                {editMode ? 'Edit Club' : 'Create New Club'}
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
                                    label="Club Name"
                                    fullWidth
                                    value={clubFormData.name}
                                    onChange={handleInputChange('name')}
                                    error={!!formErrors.name}
                                    helperText={formErrors.name}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={clubFormData.description}
                                    onChange={handleInputChange('description')}
                                    error={!!formErrors.description}
                                    helperText={formErrors.description}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!formErrors.category}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={clubFormData.category}
                                        label="Category"
                                        onChange={handleInputChange('category')}
                                    >
                                        {clubCategories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!formErrors.university}>
                                    <InputLabel>University</InputLabel>
                                    <Select
                                        value={clubFormData.university}
                                        label="University"
                                        onChange={handleInputChange('university')}
                                    >
                                        {(universities || []).map((uni) => (
                                            <MenuItem key={uni._id} value={uni._id}>
                                                {uni.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Max Members"
                                    type="number"
                                    fullWidth
                                    value={clubFormData.maxMembers}
                                    onChange={handleInputChange('maxMembers')}
                                    error={!!formErrors.maxMembers}
                                    helperText={formErrors.maxMembers}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Contact Email"
                                    type="email"
                                    fullWidth
                                    value={clubFormData.contactEmail}
                                    onChange={handleInputChange('contactEmail')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Club Rules"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={clubFormData.rules}
                                    onChange={handleInputChange('rules')}
                                />
                            </Grid>

                            {/* Social Links */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Social Links</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Website"
                                    fullWidth
                                    value={clubFormData.socialLinks.website}
                                    onChange={handleInputChange('socialLinks.website')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Facebook"
                                    fullWidth
                                    value={clubFormData.socialLinks.facebook}
                                    onChange={handleInputChange('socialLinks.facebook')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Twitter"
                                    fullWidth
                                    value={clubFormData.socialLinks.twitter}
                                    onChange={handleInputChange('socialLinks.twitter')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Instagram"
                                    fullWidth
                                    value={clubFormData.socialLinks.instagram}
                                    onChange={handleInputChange('socialLinks.instagram')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={clubFormData.isPrivate}
                                            onChange={handleSwitchChange('isPrivate')}
                                        />
                                    }
                                    label="Private Club"
                                />
                            </Grid>

                            {/* Tags */}
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1 }}>Tags</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                    {(clubFormData.tags || []).map((tag) => (
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
                </>
            )}
        </Dialog>
    );
};

export default ClubFormDialog;
