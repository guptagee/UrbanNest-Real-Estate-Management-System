const Builder = require('../models/Builder');

/**
 * Builder Controller
 * ADMIN ONLY - All builder management operations are restricted to admin users
 * Builders represent real estate development companies
 */

// @desc    Get all builders
// @route   GET /api/admin/builders
// @access  Private (Admin)
exports.getAllBuilders = async (req, res) => {
  try {
    const { search, isActive } = req.query;
    const query = {};

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Search by name or company name
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    const builders = await Builder.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: builders.length,
      data: builders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single builder
// @route   GET /api/admin/builders/:id
// @access  Private (Admin)
exports.getBuilder = async (req, res) => {
  try {
    const builder = await Builder.findById(req.params.id);

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    res.status(200).json({
      success: true,
      data: builder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new builder
// @route   POST /api/admin/builders
// @access  Private (Admin)
exports.createBuilder = async (req, res) => {
  try {
    const builder = await Builder.create(req.body);

    res.status(201).json({
      success: true,
      data: builder
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Builder with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update builder
// @route   PUT /api/admin/builders/:id
// @access  Private (Admin)
exports.updateBuilder = async (req, res) => {
  try {
    const builder = await Builder.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    res.status(200).json({
      success: true,
      data: builder
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Builder with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete builder
// @route   DELETE /api/admin/builders/:id
// @access  Private (Admin)
exports.deleteBuilder = async (req, res) => {
  try {
    const builder = await Builder.findById(req.params.id);

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    // Check if builder has associated projects
    const Project = require('../models/Project');
    const projectCount = await Project.countDocuments({ builder: builder._id });

    if (projectCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete builder. ${projectCount} project(s) are associated with this builder. Please delete or reassign projects first.`
      });
    }

    await builder.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Builder deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle builder active status
// @route   PUT /api/admin/builders/:id/toggle-status
// @access  Private (Admin)
exports.toggleBuilderStatus = async (req, res) => {
  try {
    const builder = await Builder.findById(req.params.id);

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    builder.isActive = !builder.isActive;
    await builder.save();

    res.status(200).json({
      success: true,
      data: builder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

