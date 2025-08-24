const express = require('express');
const University = require('../models/University');

const router = express.Router();

// @route   GET /api/universities
// @desc    Get all universities
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, active = true } = req.query;
        let query = {};

        // Filter by active status
        if (active === 'true') {
            query.isActive = true;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ];
        }

        const universities = await University.find(query)
            .sort({ name: 1 }); // Sort alphabetically by name

        res.json({
            success: true,
            universities,
            total: universities.length
        });
    } catch (error) {
        console.error('Get universities error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/universities/:id
// @desc    Get university by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const university = await University.findById(req.params.id);

        if (!university) {
            return res.status(404).json({
                success: false,
                message: 'University not found'
            });
        }

        res.json({
            success: true,
            university
        });
    } catch (error) {
        console.error('Get university error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/universities
// @desc    Create a new university (Admin only)
// @access  Private (Administrator only)
router.post('/', async (req, res) => {
    try {
        const {
            name,
            code,
            location,
            type,
            website,
            establishedYear
        } = req.body;

        // Check if university with same name or code exists
        const existingUniversity = await University.findOne({
            $or: [
                { name: name },
                { code: code }
            ]
        });

        if (existingUniversity) {
            return res.status(400).json({
                success: false,
                message: 'University with this name or code already exists'
            });
        }

        const university = new University({
            name,
            code,
            location,
            type,
            website,
            establishedYear
        });

        await university.save();

        res.status(201).json({
            success: true,
            message: 'University created successfully',
            university
        });
    } catch (error) {
        console.error('Create university error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
