const Report = require('../models/Report');
const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
    try {
        const { property, targetUser, subject, description } = req.body;

        // Ensure property or targetUser is provided
        if (!property && !targetUser) {
            return res.status(400).json({
                success: false,
                message: 'Please specify a property or user to report'
            });
        }

        // Validate property if provided
        if (property) {
            const propertyExists = await Property.findById(property);
            if (!propertyExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }
        }

        // Validate targetUser if provided
        if (targetUser) {
            const userExists = await User.findById(targetUser);
            if (!userExists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
        }

        const report = await Report.create({
            reporter: req.user.id,
            property,
            targetUser,
            subject,
            description,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

