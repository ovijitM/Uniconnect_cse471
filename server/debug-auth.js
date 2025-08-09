const express = require('express');
const { verifyToken } = require('./routes/auth');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());

// Debug middleware to check user details
const debugAuth = (req, res, next) => {
    console.log('Debug Auth - User:', {
        id: req.user?._id,
        name: req.user?.name,
        email: req.user?.email,
        role: req.user?.role,
        roleType: typeof req.user?.role,
        roleLength: req.user?.role?.length,
        roleBytes: req.user?.role ? Buffer.from(req.user.role) : null
    });
    next();
};

// Debug version of requireRole
const debugRequireRole = (...roles) => {
    return (req, res, next) => {
        console.log('Debug RequireRole - Required roles:', roles);
        console.log('Debug RequireRole - User role:', JSON.stringify(req.user?.role));
        console.log('Debug RequireRole - Roles includes check:', roles.includes(req.user?.role));

        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied. Insufficient permissions.',
                debug: {
                    userRole: req.user.role,
                    requiredRoles: roles,
                    includes: roles.includes(req.user.role)
                }
            });
        }

        res.json({
            message: 'Access granted!',
            userRole: req.user.role,
            requiredRoles: roles
        });
    };
};

// Test endpoint
app.post('/debug-club-request', verifyToken, debugAuth, debugRequireRole('Club Admin'), (req, res) => {
    res.json({ message: 'Club request access granted!' });
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Debug server running on port ${PORT}`);
});
