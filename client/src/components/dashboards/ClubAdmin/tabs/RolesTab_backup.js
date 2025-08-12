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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Tabs,
    Tab,
    IconButton,
    Avatar,
    Divider,
    Alert,
    Menu,
    Stack,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    MoreVert,
    Person,
    AdminPanelSettings,
    Security,
    Visibility,
    Assignment,
    AssignmentInd,
    SupervisedUserCircle,
    CheckCircle,
    Cancel,
    Search,
    Download,
    History,
    Analytics,
    People
} from '@mui/icons-material';

const RolesTab = () => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [menuTarget, setMenuTarget] = useState({ anchorEl: null, data: null });
    const [anchorEl, setAnchorEl] = useState(null);
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
                name: 'Member',
                description: 'Standard member with basic access',
                level: 'Basic',
                userCount: 145,
                permissions: ['profile', 'events_view'],
                isSystemRole: true,
                createdDate: '2024-01-01',
                lastModified: '2024-01-01',
                status: 'Active'
            }
        ],
        users: [
            {
                id: 1,
                name: 'John Smith',
                email: 'john.smith@university.edu',
                role: 'Club President',
                roleId: 1,
                assignedDate: '2024-01-01',
                lastLogin: '2024-01-25',
                status: 'Active',
                avatar: '/api/placeholder/40/40'
            },
            {
                id: 2,
                name: 'Sarah Johnson',
                email: 'sarah.j@university.edu',
                role: 'Vice President',
                roleId: 2,
                assignedDate: '2024-01-02',
                lastLogin: '2024-01-24',
                status: 'Active',
                avatar: '/api/placeholder/40/40'
            },
            {
                id: 3,
                name: 'Mike Chen',
                email: 'mike.chen@university.edu',
                role: 'Event Coordinator',
                roleId: 3,
                assignedDate: '2024-01-10',
                lastLogin: '2024-01-23',
                status: 'Active',
                avatar: '/api/placeholder/40/40'
            },
            {
                id: 4,
                name: 'Emma Davis',
                email: 'emma.d@university.edu',
                role: 'Member',
                roleId: 4,
                assignedDate: '2024-01-15',
                lastLogin: '2024-01-25',
                status: 'Active',
                avatar: '/api/placeholder/40/40'
            }
        ],
        permissions: {
            'Dashboard': ['dashboard_view', 'dashboard_manage'],
            'Members': ['members_view', 'members_add', 'members_edit', 'members_remove', 'members_export'],
            'Events': ['events_view', 'events_create', 'events_edit', 'events_delete', 'events_manage'],
            'Communications': ['comm_send', 'comm_broadcast', 'comm_templates', 'comm_analytics'],
            'Reports': ['reports_view', 'reports_generate', 'reports_export'],
            'Settings': ['settings_view', 'settings_edit', 'settings_manage'],
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

    // Menu states

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
        if (rolesData.roles.find(r => r.id === roleId)?.isSystemRole) {
            alert('Cannot delete system roles');
            return;
        }

        setRolesData(prev => ({
            ...prev,
            roles: prev.roles.filter(r => r.id !== roleId),
            users: prev.users.map(u => u.roleId === roleId ? { ...u, role: 'Member', roleId: 4 } : u)
        }));
        setAnchorEl(null);
        setMenuTarget(null);
    };    const getFilteredRoles = () => {
        let roles = rolesData.roles;

        if (searchQuery) {
            roles = roles.filter(role =>
                role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                role.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (levelFilter !== 'All') {
            roles = roles.filter(role => role.level === levelFilter);
        }

        if (statusFilter !== 'All') {
            roles = roles.filter(role => role.status === statusFilter);
        }

        return roles;
    };

    const getFilteredUsers = () => {
        let users = rolesData.users;

        if (searchQuery) {
            users = users.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return users;
    };

    const RolesList = () => {
        const filteredRoles = getFilteredRoles();
        const paginatedRoles = filteredRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return (
            <>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Role</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Users</TableCell>
                                <TableCell>Permissions</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Last Modified</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedRoles.map((role) => (
                                <TableRow key={role.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                {role.level === 'Executive' && <AdminPanelSettings />}
                                                {role.level === 'Management' && <SupervisedUserCircle />}
                                                {role.level === 'Basic' && <Person />}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="medium">
                                                    {role.name}
                                                    {role.isSystemRole && (
                                                        <Chip
                                                            label="System"
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                            color="default"
                                                        />
                                                    )}
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
                                            size="small"
                                            color={
                                                role.level === 'Executive' ? 'error' :
                                                    role.level === 'Management' ? 'warning' : 'default'
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {role.userCount} users
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {role.permissions.includes('all') ? 'All Permissions' :
                                                `${role.permissions.length} permissions`}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={role.status}
                                            size="small"
                                            color={role.status === 'Active' ? 'success' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(role.lastModified).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                setAnchorEl(e.currentTarget);
                                                setMenuTarget({ type: 'role', data: role });
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
                    count={filteredRoles.length}
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

    const UsersList = () => {
        const filteredUsers = getFilteredUsers();
        const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return (
            <>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Assigned Date</TableCell>
                                <TableCell>Last Login</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={user.avatar} sx={{ mr: 2 }}>
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="medium">
                                                    {user.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Chip label={user.role} size="small" />
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setAssignRoleDialog(true);
                                                }}
                                                sx={{ ml: 1 }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(user.assignedDate).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(user.lastLogin).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.status}
                                            size="small"
                                            color={user.status === 'Active' ? 'success' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                setAnchorEl(e.currentTarget);
                                                setMenuTarget({ type: 'user', data: user });
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
                    count={filteredUsers.length}
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

    const PermissionsMatrix = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Role Permissions Matrix
            </Typography>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Module</TableCell>
                            {rolesData.roles.map(role => (
                                <TableCell key={role.id} align="center">
                                    {role.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(rolesData.permissions).map(([module, permissions]) => (
                            <React.Fragment key={module}>
                                <TableRow>
                                    <TableCell
                                        colSpan={rolesData.roles.length + 1}
                                        sx={{ bgcolor: 'action.hover', fontWeight: 'bold' }}
                                    >
                                        {module}
                                    </TableCell>
                                </TableRow>
                                {permissions.map(permission => (
                                    <TableRow key={permission}>
                                        <TableCell sx={{ pl: 4 }}>
                                            {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </TableCell>
                                        {rolesData.roles.map(role => (
                                            <TableCell key={role.id} align="center">
                                                {role.permissions.includes('all') ||
                                                    role.permissions.includes(permission.split('_')[0]) ? (
                                                    <CheckCircle color="success" />
                                                ) : (
                                                    <Cancel color="disabled" />
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Role Management
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<Assignment />}
                        onClick={() => setPermissionsDialog(true)}
                    >
                        Permissions Matrix
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setCreateRoleDialog(true)}
                    >
                        Create Role
                    </Button>
                </Stack>
            </Box>

            {/* Role Management Tabs */}
            <Card sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab icon={<Security />} label="Roles" />
                    <Tab icon={<People />} label="User Assignments" />
                    <Tab icon={<Analytics />} label="Permissions Overview" />
                </Tabs>
            </Card>

            {/* Filters and Search */}
            <Card sx={{ mb: 3, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder={tabValue === 0 ? "Search roles..." : "Search users..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>
                    {tabValue === 0 && (
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
                    )}
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
            </Card>

            {/* Content Area */}
            <Card>
                {tabValue === 0 && <RolesList />}
                {tabValue === 1 && <UsersList />}
                {tabValue === 2 && (
                    <CardContent>
                        <PermissionsMatrix />
                    </CardContent>
                )}
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {menuTarget?.type === 'role' && (
                    <>
                        <MenuItem
                            onClick={() => {
                                setSelectedRole(menuTarget.data);
                                setEditRoleDialog(true);
                                setAnchorEl(null);
                            }}
                        >
                            <Edit sx={{ mr: 1 }} />
                            Edit Role
                        </MenuItem>
                        <MenuItem onClick={() => setAnchorEl(null)}>
                            <Visibility sx={{ mr: 1 }} />
                            View Details
                        </MenuItem>
                        <MenuItem onClick={() => setAnchorEl(null)}>
                            <Assignment sx={{ mr: 1 }} />
                            Manage Permissions
                        </MenuItem>
                        <Divider />
                        {!menuTarget.data?.isSystemRole && (
                            <MenuItem
                                onClick={() => handleDeleteRole(menuTarget.data.id)}
                                sx={{ color: 'error.main' }}
                            >
                                <Delete sx={{ mr: 1 }} />
                                Delete Role
                            </MenuItem>
                        )}
                    </>
                )}
                {menuTarget?.type === 'user' && (
                    <>
                        <MenuItem
                            onClick={() => {
                                setSelectedUser(menuTarget.data);
                                setAssignRoleDialog(true);
                                setAnchorEl(null);
                            }}
                        >
                            <AssignmentInd sx={{ mr: 1 }} />
                            Change Role
                        </MenuItem>
                        <MenuItem onClick={() => setAnchorEl(null)}>
                            <Visibility sx={{ mr: 1 }} />
                            View Profile
                        </MenuItem>
                        <MenuItem onClick={() => setAnchorEl(null)}>
                            <History sx={{ mr: 1 }} />
                            Role History
                        </MenuItem>
                    </>
                )}
            </Menu>

            {/* Create Role Dialog */}
            <Dialog
                open={createRoleDialog}
                onClose={() => setCreateRoleDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Create New Role</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Role Name"
                                    value={newRole.name}
                                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Level</InputLabel>
                                    <Select
                                        value={newRole.level}
                                        onChange={(e) => setNewRole({ ...newRole, level: e.target.value })}
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
                                    value={newRole.description}
                                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Permissions
                                </Typography>
                                <FormGroup>
                                    {Object.keys(rolesData.permissions).map(module => (
                                        <FormControlLabel
                                            key={module}
                                            control={
                                                <Checkbox
                                                    checked={newRole.permissions.includes(module.toLowerCase())}
                                                    onChange={(e) => {
                                                        const moduleKey = module.toLowerCase();
                                                        if (e.target.checked) {
                                                            setNewRole({
                                                                ...newRole,
                                                                permissions: [...newRole.permissions, moduleKey]
                                                            });
                                                        } else {
                                                            setNewRole({
                                                                ...newRole,
                                                                permissions: newRole.permissions.filter(p => p !== moduleKey)
                                                            });
                                                        }
                                                    }}
                                                />
                                            }
                                            label={module}
                                        />
                                    ))}
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateRoleDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateRole} variant="contained">
                        Create Role
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog
                open={editRoleDialog}
                onClose={() => setEditRoleDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Role</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Edit role functionality would be implemented here with pre-filled values.
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditRoleDialog(false)}>Cancel</Button>
                    <Button variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Assign Role Dialog */}
            <Dialog
                open={assignRoleDialog}
                onClose={() => setAssignRoleDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Change User Role</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ pt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar src={selectedUser.avatar} sx={{ mr: 2 }}>
                                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{selectedUser.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Current Role: {selectedUser.role}
                                    </Typography>
                                </Box>
                            </Box>

                            <FormControl fullWidth>
                                <InputLabel>New Role</InputLabel>
                                <Select
                                    defaultValue={selectedUser.roleId}
                                    label="New Role"
                                >
                                    {rolesData.roles.map(role => (
                                        <MenuItem key={role.id} value={role.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Chip label={role.level} size="small" sx={{ mr: 1 }} />
                                                {role.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignRoleDialog(false)}>Cancel</Button>
                    <Button variant="contained">Assign Role</Button>
                </DialogActions>
            </Dialog>

            {/* Permissions Matrix Dialog */}
            <Dialog
                open={permissionsDialog}
                onClose={() => setPermissionsDialog(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>Permissions Matrix</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <PermissionsMatrix />
                    </Box>
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
