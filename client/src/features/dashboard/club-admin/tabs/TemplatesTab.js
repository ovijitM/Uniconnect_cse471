import React, { useState } from 'react';
import {
    Box,
    Card,
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
    Paper,
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
    Divider,
    Switch,
    FormControlLabel,
    Menu,
    Autocomplete,
    Alert
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    MoreVert,
    FileCopy,
    Visibility,
    GetApp,
    Event,
    Article,
    Search,
    Star,
    StarBorder,
    Share
} from '@mui/icons-material';

const TemplatesTab = () => {
    const [tabValue, setTabValue] = useState(0);
    const [templatesData, setTemplatesData] = useState({
        eventTemplates: [
            {
                id: 1,
                name: "Academic Workshop",
                category: "Educational",
                type: "Event",
                description: "Standard template for academic workshops and seminars",
                lastUsed: "2024-01-15",
                usageCount: 12,
                isFavorite: true,
                isPublic: false,
                tags: ["workshop", "academic", "seminar"],
                createdBy: "Admin User",
                createdDate: "2024-01-01",
                status: "Active"
            },
            {
                id: 2,
                name: "Social Mixer",
                category: "Social",
                type: "Event",
                description: "Template for social events and networking sessions",
                lastUsed: "2024-01-20",
                usageCount: 8,
                isFavorite: false,
                isPublic: true,
                tags: ["social", "networking", "mixer"],
                createdBy: "Event Coordinator",
                createdDate: "2024-01-05",
                status: "Active"
            },
            {
                id: 3,
                name: "Competition Event",
                category: "Competition",
                type: "Event",
                description: "Template for hackathons, contests, and competitions",
                lastUsed: "2024-01-10",
                usageCount: 5,
                isFavorite: true,
                isPublic: false,
                tags: ["competition", "hackathon", "contest"],
                createdBy: "Competition Manager",
                createdDate: "2024-01-03",
                status: "Active"
            }
        ],
        contentTemplates: [
            {
                id: 1,
                name: "Event Announcement",
                category: "Communication",
                type: "Email",
                description: "Standard email template for event announcements",
                lastUsed: "2024-01-22",
                usageCount: 25,
                isFavorite: true,
                isPublic: true,
                tags: ["email", "announcement", "event"],
                createdBy: "Communications Team",
                createdDate: "2024-01-01",
                status: "Active"
            },
            {
                id: 2,
                name: "Newsletter Format",
                category: "Communication",
                type: "Newsletter",
                description: "Monthly newsletter template with sections for events and updates",
                lastUsed: "2024-01-18",
                usageCount: 15,
                isFavorite: false,
                isPublic: false,
                tags: ["newsletter", "monthly", "updates"],
                createdBy: "Content Creator",
                createdDate: "2024-01-02",
                status: "Active"
            },
            {
                id: 3,
                name: "Social Media Post",
                category: "Marketing",
                type: "Social Media",
                description: "Template for Instagram and Facebook event promotion posts",
                lastUsed: "2024-01-25",
                usageCount: 30,
                isFavorite: true,
                isPublic: true,
                tags: ["social media", "promotion", "instagram"],
                createdBy: "Marketing Team",
                createdDate: "2024-01-01",
                status: "Active"
            }
        ]
    });

    // Dialog states
    const [createTemplateDialog, setCreateTemplateDialog] = useState(false);
    const [editTemplateDialog, setEditTemplateDialog] = useState(false);
    const [previewDialog, setPreviewDialog] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Form states
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        category: '',
        type: '',
        description: '',
        tags: [],
        isPublic: false,
        content: ''
    });

    // Table and pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [favoriteFilter, setFavoriteFilter] = useState(false);

    // Menu states
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuTemplate, setMenuTemplate] = useState(null);

    const getCurrentTemplates = () => {
        return tabValue === 0 ? templatesData.eventTemplates : templatesData.contentTemplates;
    };

    const getFilteredTemplates = () => {
        let templates = getCurrentTemplates();

        if (searchQuery) {
            templates = templates.filter(template =>
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (categoryFilter !== 'All') {
            templates = templates.filter(template => template.category === categoryFilter);
        }

        if (typeFilter !== 'All') {
            templates = templates.filter(template => template.type === typeFilter);
        }

        if (favoriteFilter) {
            templates = templates.filter(template => template.isFavorite);
        }

        return templates;
    };

    const handleCreateTemplate = () => {
        const newTemplateData = {
            ...newTemplate,
            id: Date.now(),
            lastUsed: new Date().toISOString().split('T')[0],
            usageCount: 0,
            isFavorite: false,
            createdBy: "Current User",
            createdDate: new Date().toISOString().split('T')[0],
            status: "Active"
        };

        if (tabValue === 0) {
            setTemplatesData(prev => ({
                ...prev,
                eventTemplates: [...prev.eventTemplates, newTemplateData]
            }));
        } else {
            setTemplatesData(prev => ({
                ...prev,
                contentTemplates: [...prev.contentTemplates, newTemplateData]
            }));
        }

        setNewTemplate({
            name: '',
            category: '',
            type: '',
            description: '',
            tags: [],
            isPublic: false,
            content: ''
        });
        setCreateTemplateDialog(false);
    };

    const handleEditTemplate = () => {
        // Implementation for editing template
        setEditTemplateDialog(false);
        setSelectedTemplate(null);
    };

    const handleDeleteTemplate = (templateId) => {
        if (tabValue === 0) {
            setTemplatesData(prev => ({
                ...prev,
                eventTemplates: prev.eventTemplates.filter(t => t.id !== templateId)
            }));
        } else {
            setTemplatesData(prev => ({
                ...prev,
                contentTemplates: prev.contentTemplates.filter(t => t.id !== templateId)
            }));
        }
        setAnchorEl(null);
        setMenuTemplate(null);
    };

    const handleToggleFavorite = (templateId) => {
        const updateTemplates = (templates) =>
            templates.map(t => t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t);

        if (tabValue === 0) {
            setTemplatesData(prev => ({
                ...prev,
                eventTemplates: updateTemplates(prev.eventTemplates)
            }));
        } else {
            setTemplatesData(prev => ({
                ...prev,
                contentTemplates: updateTemplates(prev.contentTemplates)
            }));
        }
    };

    const handleDuplicateTemplate = (template) => {
        const duplicatedTemplate = {
            ...template,
            id: Date.now(),
            name: `${template.name} (Copy)`,
            usageCount: 0,
            lastUsed: new Date().toISOString().split('T')[0],
            createdDate: new Date().toISOString().split('T')[0]
        };

        if (tabValue === 0) {
            setTemplatesData(prev => ({
                ...prev,
                eventTemplates: [...prev.eventTemplates, duplicatedTemplate]
            }));
        } else {
            setTemplatesData(prev => ({
                ...prev,
                contentTemplates: [...prev.contentTemplates, duplicatedTemplate]
            }));
        }
        setAnchorEl(null);
        setMenuTemplate(null);
    };

    const getCategoryOptions = () => {
        if (tabValue === 0) {
            return ["Educational", "Social", "Competition", "Workshop", "Seminar"];
        } else {
            return ["Communication", "Marketing", "Newsletter", "Announcement"];
        }
    };

    const getTypeOptions = () => {
        if (tabValue === 0) {
            return ["Event", "Workshop", "Seminar", "Competition", "Meeting"];
        } else {
            return ["Email", "Newsletter", "Social Media", "SMS", "Push Notification"];
        }
    };

    const filteredTemplates = getFilteredTemplates();
    const paginatedTemplates = filteredTemplates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Template Library
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setCreateTemplateDialog(true)}
                    size="large"
                >
                    Create Template
                </Button>
            </Box>

            {/* Template Type Tabs */}
            <Card sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab icon={<Event />} label="Event Templates" />
                    <Tab icon={<Article />} label="Content Templates" />
                </Tabs>
            </Card>

            {/* Filters and Search */}
            <Card sx={{ mb: 3, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                label="Category"
                            >
                                <MenuItem value="All">All Categories</MenuItem>
                                {getCategoryOptions().map(category => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                label="Type"
                            >
                                <MenuItem value="All">All Types</MenuItem>
                                {getTypeOptions().map(type => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={favoriteFilter}
                                    onChange={(e) => setFavoriteFilter(e.target.checked)}
                                />
                            }
                            label="Favorites Only"
                        />
                    </Grid>
                </Grid>
            </Card>

            {/* Templates Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Template</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Usage</TableCell>
                                <TableCell>Last Used</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedTemplates.map((template) => (
                                <TableRow key={template.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleToggleFavorite(template.id)}
                                            >
                                                {template.isFavorite ? <Star color="warning" /> : <StarBorder />}
                                            </IconButton>
                                            <Box sx={{ ml: 1 }}>
                                                <Typography variant="subtitle2" fontWeight="medium">
                                                    {template.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {template.description}
                                                </Typography>
                                                <Box sx={{ mt: 0.5 }}>
                                                    {template.tags.map(tag => (
                                                        <Chip
                                                            key={tag}
                                                            label={tag}
                                                            size="small"
                                                            sx={{ mr: 0.5, mb: 0.5 }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={template.category} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={template.type} variant="outlined" size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {template.usageCount} times
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(template.lastUsed).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={template.status}
                                            color={template.status === 'Active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                        {template.isPublic && (
                                            <Chip
                                                label="Public"
                                                size="small"
                                                sx={{ ml: 0.5 }}
                                                color="info"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                setAnchorEl(e.currentTarget);
                                                setMenuTemplate(template);
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
                    count={filteredTemplates.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => {
                    setAnchorEl(null);
                    setMenuTemplate(null);
                }}
            >
                <MenuItem
                    onClick={() => {
                        setSelectedTemplate(menuTemplate);
                        setPreviewDialog(true);
                        setAnchorEl(null);
                    }}
                >
                    <Visibility sx={{ mr: 1 }} />
                    Preview
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setSelectedTemplate(menuTemplate);
                        setEditTemplateDialog(true);
                        setAnchorEl(null);
                    }}
                >
                    <Edit sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={() => handleDuplicateTemplate(menuTemplate)}>
                    <FileCopy sx={{ mr: 1 }} />
                    Duplicate
                </MenuItem>
                <Divider />
                <MenuItem>
                    <GetApp sx={{ mr: 1 }} />
                    Export
                </MenuItem>
                <MenuItem>
                    <Share sx={{ mr: 1 }} />
                    Share
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => handleDeleteTemplate(menuTemplate.id)}
                    sx={{ color: 'error.main' }}
                >
                    <Delete sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Create Template Dialog */}
            <Dialog
                open={createTemplateDialog}
                onClose={() => setCreateTemplateDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Create New Template</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Template Name"
                                    value={newTemplate.name}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={newTemplate.category}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                                        label="Category"
                                    >
                                        {getCategoryOptions().map(category => (
                                            <MenuItem key={category} value={category}>{category}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={newTemplate.type}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                                        label="Type"
                                    >
                                        {getTypeOptions().map(type => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={newTemplate.description}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={[]}
                                    value={newTemplate.tags}
                                    onChange={(e, newValue) => setNewTemplate({ ...newTemplate, tags: newValue })}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Tags" placeholder="Add tags..." />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Template Content"
                                    value={newTemplate.content}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                                    multiline
                                    rows={6}
                                    placeholder="Enter your template content here..."
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={newTemplate.isPublic}
                                            onChange={(e) => setNewTemplate({ ...newTemplate, isPublic: e.target.checked })}
                                        />
                                    }
                                    label="Make this template public"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateTemplateDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateTemplate} variant="contained">
                        Create Template
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Template Dialog */}
            <Dialog
                open={editTemplateDialog}
                onClose={() => setEditTemplateDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Template</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Edit template functionality would be implemented here with pre-filled form values.
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditTemplateDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditTemplate} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Preview Template Dialog */}
            <Dialog
                open={previewDialog}
                onClose={() => setPreviewDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Template Preview</DialogTitle>
                <DialogContent>
                    {selectedTemplate && (
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedTemplate.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {selectedTemplate.description}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Chip label={selectedTemplate.category} sx={{ mr: 1 }} />
                                <Chip label={selectedTemplate.type} variant="outlined" />
                            </Box>
                            <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                                <Typography variant="body1">
                                    Template content preview would be displayed here...
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewDialog(false)}>Close</Button>
                    <Button variant="contained">Use Template</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TemplatesTab;
