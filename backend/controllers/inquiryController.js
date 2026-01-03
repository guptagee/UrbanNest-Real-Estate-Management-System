const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const Project = require('../models/Project');
const Unit = require('../models/Unit');

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Private (Users only)
exports.createInquiry = async (req, res) => {
    try {
        // Only users (buyers) can create inquiries
        if (req.user.role !== 'user') {
            return res.status(403).json({
                success: false,
                message: 'Only buyers can send inquiries'
            });
        }

        const { property, project, unit, message, contactPreference, userEmail, userPhone } = req.body;

        // Validate that either property OR (project/unit) is provided
        if (!property && !project && !unit) {
            return res.status(400).json({
                success: false,
                message: 'Please provide either a property, project, or unit'
            });
        }

        if (property && (project || unit)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot specify both property and project/unit'
            });
        }

        // Set user
        req.body.user = req.user.id;

        // Handle property inquiry
        if (property) {
            const propertyDoc = await Property.findById(property).populate('agent owner');
            if (!propertyDoc) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }
            req.body.agent = propertyDoc.agent || propertyDoc.owner;
            req.body.inquiryType = 'property';
        }
        // Handle project/unit inquiry
        else if (project || unit) {
            if (unit) {
                const unitDoc = await Unit.findById(unit).populate('project');
                if (!unitDoc) {
                    return res.status(404).json({
                        success: false,
                        message: 'Unit not found'
                    });
                }
                req.body.project = unitDoc.project._id;
                req.body.inquiryType = 'unit';
            } else {
                const projectDoc = await Project.findById(project);
                if (!projectDoc) {
                    return res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                }
                req.body.inquiryType = 'project';
            }
            // For project/unit inquiries, admin manages them (no agent assigned by default)
            // Admin can assign an agent later if needed
        }

        const inquiry = await Inquiry.create(req.body);

        // Populate the created inquiry based on inquiry type
        let populatedInquiry;
        if (inquiry.inquiryType === 'property') {
            populatedInquiry = await Inquiry.findById(inquiry._id)
                .populate('property', 'title location price images')
                .populate('user', 'name email phone')
                .populate('agent', 'name email phone');
        } else {
            populatedInquiry = await Inquiry.findById(inquiry._id)
                .populate('project', 'name location builder')
                .populate('unit', 'unitNumber unitType area price')
                .populate('user', 'name email phone')
                .populate('agent', 'name email phone');
        }

        res.status(201).json({
            success: true,
            data: populatedInquiry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private
exports.getInquiries = async (req, res) => {
    try {
        const { status, property } = req.query;
        let query = {};

        // Users can only see their own inquiries
        if (req.user.role === 'user') {
            query.user = req.user.id;
        }
        // Agents can see inquiries for their properties
        else if (req.user.role === 'agent') {
            query.agent = req.user.id;
        }
        // Admins can see all inquiries

        // Apply filters
        if (status) query.status = status;
        if (property) query.property = property;

        const inquiries = await Inquiry.find(query)
            .populate('property', 'title location price images')
            .populate('project', 'name location builder images')
            .populate('unit', 'unitNumber unitType area price')
            .populate('user', 'name email phone')
            .populate('agent', 'name email phone')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
// @access  Private
exports.getInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id)
            .populate('property')
            .populate('project')
            .populate('unit')
            .populate('user', 'name email phone')
            .populate('agent', 'name email phone');

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        // Check authorization
        if (
            req.user.role === 'user' && inquiry.user._id.toString() !== req.user.id ||
            req.user.role === 'agent' && inquiry.agent._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this inquiry'
            });
        }

        res.status(200).json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private (Agent/Admin)
exports.updateInquiry = async (req, res) => {
    try {
        let inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        // Check authorization
        if (req.user.role === 'agent' && inquiry.agent.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this inquiry'
            });
        }

        req.body.updatedAt = Date.now();

        inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('property', 'title location price')
            .populate('project', 'name location builder')
            .populate('unit', 'unitNumber unitType area price')
            .populate('user', 'name email phone')
            .populate('agent', 'name email phone');

        res.status(200).json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Agent/Admin)
exports.deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        // Check authorization
        if (
            req.user.role === 'agent' && inquiry.agent.toString() !== req.user.id &&
            req.user.role === 'user' && inquiry.user.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this inquiry'
            });
        }

        await inquiry.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Inquiry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get inquiry statistics for agent
// @route   GET /api/inquiries/stats
// @access  Private (Agent/Admin)
exports.getInquiryStats = async (req, res) => {
    try {
        const query = req.user.role === 'agent' ? { agent: req.user.id } : {};

        const stats = await Inquiry.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await Inquiry.countDocuments(query);
        const thisMonth = await Inquiry.countDocuments({
            ...query,
            createdAt: { $gte: new Date(new Date().setDate(1)) }
        });

        const formattedStats = {
            total,
            thisMonth,
            byStatus: stats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {})
        };

        res.status(200).json({
            success: true,
            data: formattedStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
