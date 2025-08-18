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
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel,
    IconButton,
    Tooltip,
    Menu,
    Divider,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    InputAdornment,
    Alert,
    LinearProgress
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    PersonAdd,
    Security,
    Search,
    MoreVert,
    CheckCircle,
    Cancel,
    Group,
    Settings,
    Visibility,
    Download,
    Shield,
    AdminPanelSettings,
    SupervisorAccount,
    Person,
    FilterList
} from '@mui/icons-material';

const RolesTab = () => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [menuTarget, setMenuTarget] = useState({ anchorEl: null, data: null });
    const [rolesData, setRolesData] = useState({
        roles: [
            {
                id: 1,
                name: 'Club President',
                description: 'Full administrative access to all club functions',
                level: 'Executive',
                userCount: 1,
                permissions: ['all'],
                isSystemRole: true,
                createdDate: '2024-01-01',
                lastModified: '2024-01-15',
                status: 'Active'
            },
            {
                id: 2,
                name: 'Vice President',
                description: 'Administrative access with some restrictions',
                level: 'Executive',
                userCount: 2,
                permissions: ['members', 'events', 'communications'],
                isSystemRole: true,
                createdDate: '2024-01-01',
                lastModified: '2024-01-10',
                status: 'Active'
            },
            {
                id: 3,
                name: 'Event Coordinator',
                description: 'Manages events and related activities',
                level: 'Management',
                userCount: 3,
                permissions: ['events', 'communications'],
                isSystemRole: false,
                createdDate: '2024-01-05',
                lastModified: '2024-01-20',
                status: 'Active'
            },
            {
                id: 4,
                name: 'Content Manager',
                description: 'Manages content and communications',
                level: 'Management',
                userCount: 2,
                permissions: ['communications', 'content'],
                isSystemRole: false,
                createdDate: '2024-01-08',
                lastModified: '2024-01-18',
                status: 'Active'
            },
            {
                id: 5,
                name: 'Member',
                description: 'Basic member access to club resources',
                level: 'Basic',
                userCount: 45,
                permissions: ['profile', 'events_view'],
                isSystemRole: true,
                createdDate: '2024-01-01',
                lastModified: '2024-01-01',
                status: 'Active'
            }
        ],
        userRoles: [
            {
                id: 1,
                userId: 'u1',
                userName: 'John Smith',
                userEmail: 'john.smith@university.edu',
                roleId: 1,
                roleName: 'Club President',
                assignedBy: 'System',
                assignedDate: '2024-01-01',
                status: 'Active'
            },
            {
                id: 2,
                userId: 'u2',
                userName: 'Sarah Johnson',
                userEmail: 'sarah.j@university.edu',
                roleId: 2,
                roleName: 'Vice President',
                assignedBy: 'John Smith',
                assignedDate: '2024-01-05',
                status: 'Active'
            },
            {
                id: 3,
                userId: 'u3',
                userName: 'Mike Wilson',
                userEmail: 'mike.w@university.edu',
                roleId: 3,
                roleName: 'Event Coordinator',
                assignedBy: 'John Smith',
                assignedDate: '2024-01-10',
                status: 'Active'
            }
        ],
        permissions: {
            'Dashboard': ['dashboard_view', 'dashboard_analytics'],
            'Members': ['members_view', 'members_create', 'members_edit', 'members_delete'],
            'Events': ['events_view', 'events_create', 'events_edit', 'events_delete', 'events_publish'],
            'Communications': ['comm_view', 'comm_send', 'comm_campaign', 'comm_template'],
            'Analytics': ['analytics_view', 'analytics_export', 'analytics_advanced'],
            'Settings': ['settings_view', 'settings_edit', 'settings_system'],
            'Roles': ['roles_view', 'roles_create', 'roles_edit', 'roles_assign'],
            'Profile': ['profile_view', 'profile_edit']
        }
    });

    // Dialog states
    const [createRoleDialog, setCreateRoleDialog] = useState(false);
    const [editRoleDialog, setEditRoleDialog] = useState(false);
    const [assignRoleDialog, setAssignRoleDialog] = useState(false);
    const [permissionsDialog, setPermissionsDialog] = useState(false);

    // Form states
    const [newRole, setNewRole] = useState({
        name: '',
        description: '',
        level: 'Basic',
        permissions: []
    });

    // Table and filter states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const handleCreateRole = () => {
        const roleData = {
            ...newRole,
            id: Date.now(),
            userCount: 0,
            isSystemRole: false,
            createdDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0],
            status: 'Active'
        };

        setRolesData(prev => ({
            ...prev,
            roles: [...prev.roles, roleData]
        }));

        setNewRole({
            name: '',
            description: '',
            level: 'Basic',
            permissions: []
        });
        setCreateRoleDialog(false);
    };

    const handleDeleteRole = (roleId) => {
        setRolesData(prev => ({
            ...prev,
            roles: prev.roles.filter(role => role.id !== roleId)
        }));
    };

    const handleAssignRole = (userId, roleId) => {
        const user = rolesData.userRoles.find(ur => ur.userId === userId);
        const role = rolesData.roles.find(r => r.id === roleId);

        if (user && role) {
            const assignment = {
                id: Date.now(),
                userId: user.userId,
                userName: user.userName,
                userEmail: user.userEmail,
                roleId: role.id,
                roleName: role.name,
                assignedBy: 'Current User',
                assignedDate: new Date().toISOString().split('T')[0],
                status: 'Active'
            };

            setRolesData(prev => ({
                ...prev,
                userRoles: [...prev.userRoles, assignment]
            }));
        }
        setAssignRoleDialog(false);
    };

    const handleMenuClick = (event, data) => {
        setMenuTarget({ anchorEl: event.currentTarget, data });
    };

    const handleMenuClose = () => {
        setMenuTarget({ anchorEl: null, data: null });
    };

    const filteredRoles = rolesData.roles.filter(role => {
        const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = levelFilter === 'All' || role.level === levelFilter;
        const matchesStatus = statusFilter === 'All' || role.status === statusFilter;

        return matchesSearch && matchesLevel && matchesStatus;
    });

    const getRoleIcon = (level) => {
        switch (level) {
            case 'Executive': return <AdminPanelSettings />;
            case 'Management': return <SupervisorAccount />;
            case 'Basic': return <Person />;
            default: return <Shield />;
        }
    };

    const getRoleColor = (level) => {
        switch (level) {
            case 'Executive': return 'error';
            case 'Management': return 'warning';
            case 'Basic': return 'primary';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab label="Role Management" />
                    <Tab label="User Assignments" />
                    <Tab label="Permissions Matrix" />
                </Tabs>
            </Box>

            {/* Role Management Tab */}
            {tabValue === 0 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" component="h2">
                            Role Management
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setCreateRoleDialog(true)}
                        >
                            Create Role
                        </Button>
                    </Box>

                    {/* Filters */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        placeholder="Search roles..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Level</InputLabel>
                                        <Select
                                            value={levelFilter}
                                            onChange={(e) => setLevelFilter(e.target.value)}
                                            label="Level"
                                        >
                                            <MenuItem value="All">All Levels</MenuItem>
                                            <MenuItem value="Executive">Executive</MenuItem>
                                            <MenuItem value="Management">Management</MenuItem>
                                            <MenuItem value="Basic">Basic</MenuItem>
                                        </Select>
                                    </FormControl>
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
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Roles Table */}
                    <Card>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Level</TableCell>
                                        <TableCell>Users</TableCell>
                                        <TableCell>Permissions</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Modified</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRoles
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((role) => (
                                            <TableRow key={role.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {getRoleIcon(role.level)}
                                                        <Box>
                                                            <Typography variant="subtitle2">
                                                                {role.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {role.description}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={role.level}
                                                        color={getRoleColor(role.level)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {role.userCount} users
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {role.permissions.length} permissions
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={role.status}
                                                        color={role.status === 'Active' ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {new Date(role.lastModified).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedRole(role);
                                                                setEditRoleDialog(true);
                                                            }}
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => handleMenuClick(e, role)}
                                                        >
                                                            <MoreVert fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={filteredRoles.length}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                        />
                    </Card>
                </Box>
            )}

            {/* User Assignments Tab */}
            {tabValue === 1 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" component="h2">
                            User Role Assignments
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<PersonAdd />}
                            onClick={() => setAssignRoleDialog(true)}
                        >
                            Assign Role
                        </Button>
                    </Box>

                    <Card>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Assigned By</TableCell>
                                        <TableCell>Assigned Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rolesData.userRoles.map((userRole) => (
                                        <TableRow key={userRole.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32 }}>
                                                        {userRole.userName.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            {userRole.userName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {userRole.userEmail}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={userRole.roleName}
                                                    color="primary"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {userRole.assignedBy}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(userRole.assignedDate).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={userRole.status}
                                                    color={userRole.status === 'Active' ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedUser(userRole);
                                                            setEditRoleDialog(true);
                                                        }}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Box>
            )}

            {/* Permissions Matrix Tab */}
            {tabValue === 2 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" component="h2">
                            Permissions Matrix
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => setPermissionsDialog(true)}
                        >
                            View Full Matrix
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        {Object.entries(rolesData.permissions).map(([category, perms]) => (
                            <Grid item xs={12} md={6} lg={4} key={category}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {category}
                                        </Typography>
                                        <List dense>
                                            {perms.map((perm) => (
                                                <ListItem key={perm} disablePadding>
                                                    <ListItemIcon>
                                                        <Security fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={perm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        primaryTypographyProps={{ variant: 'body2' }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Role Menu */}
            <Menu
                anchorEl={menuTarget.anchorEl}
                open={Boolean(menuTarget.anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    setSelectedRole(menuTarget.data);
                    setEditRoleDialog(true);
                    handleMenuClose();
                }}>
                    <Edit fontSize="small" sx={{ mr: 1 }} />
                    Edit Role
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                }}>
                    <PersonAdd fontSize="small" sx={{ mr: 1 }} />
                    Assign Users
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => {
                        handleDeleteRole(menuTarget.data?.id);
                        handleMenuClose();
                    }}
                    sx={{ color: 'error.main' }}
                    disabled={menuTarget.data?.isSystemRole}
                >
                    <Delete fontSize="small" sx={{ mr: 1 }} />
                    Delete Role
                </MenuItem>
            </Menu>

            {/* Create Role Dialog */}
            <Dialog open={createRoleDialog} onClose={() => setCreateRoleDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Role Name"
                                    value={newRole.name}
                                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Level</InputLabel>
                                    <Select
                                        value={newRole.level}
                                        onChange={(e) => setNewRole(prev => ({ ...prev, level: e.target.value }))}
                                        label="Level"
                                    >
                                        <MenuItem value="Basic">Basic</MenuItem>
                                        <MenuItem value="Management">Management</MenuItem>
                                        <MenuItem value="Executive">Executive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={newRole.description}
                                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Permissions
                                </Typography>
                                <FormGroup>
                                    {Object.entries(rolesData.permissions).map(([category, perms]) => (
                                        <Box key={category} sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                                {category}
                                            </Typography>
                                            <Grid container>
                                                {perms.map((perm) => (
                                                    <Grid item xs={6} md={4} key={perm}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={newRole.permissions.includes(perm)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setNewRole(prev => ({
                                                                                ...prev,
                                                                                permissions: [...prev.permissions, perm]
                                                                            }));
                                                                        } else {
                                                                            setNewRole(prev => ({
                                                                                ...prev,
                                                                                permissions: prev.permissions.filter(p => p !== perm)
                                                                            }));
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                            label={perm.replace(/_/g, ' ')}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                            <Divider sx={{ mt: 1 }} />
                                        </Box>
                                    ))}
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateRoleDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateRole}
                        disabled={!newRole.name || !newRole.description}
                    >
                        Create Role
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Permissions Matrix Dialog */}
            <Dialog open={permissionsDialog} onClose={() => setPermissionsDialog(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Complete Permissions Matrix</DialogTitle>
                <DialogContent>
                    <TableContainer sx={{ mt: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Permission Category</TableCell>
                                    {rolesData.roles.map((role) => (
                                        <TableCell key={role.id} align="center">
                                            {role.name}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(rolesData.permissions).map(([category, perms]) => (
                                    perms.map((perm) => (
                                        <TableRow key={`${category}-${perm}`}>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {category} - {perm.replace(/_/g, ' ')}
                                                </Typography>
                                            </TableCell>
                                            {rolesData.roles.map((role) => (
                                                <TableCell key={role.id} align="center">
                                                    {(role.permissions.includes('all') || role.permissions.includes(perm)) ? (
                                                        <CheckCircle color="success" fontSize="small" />
                                                    ) : (
                                                        <Cancel color="disabled" fontSize="small" />
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPermissionsDialog(false)}>Close</Button>
                    <Button variant="contained" startIcon={<Download />}>
                        Export Matrix
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RolesTab;
