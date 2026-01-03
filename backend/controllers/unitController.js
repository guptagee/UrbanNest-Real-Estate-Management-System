const Unit = require('../models/Unit');
const Project = require('../models/Project');

/**
 * Unit Controller
 * ADMIN ONLY - All unit management operations are restricted to admin users
 * Units represent individual inventory units within a project
 */

// @desc    Get all units
// @route   GET /api/admin/units
// @access  Private (Admin)
exports.getAllUnits = async (req, res) => {
  try {
    const { project, unitType, availabilityStatus, search } = req.query;
    const query = {};

    // Filter by project
    if (project) {
      query.project = project;
    }

    // Filter by unit type
    if (unitType) {
      query.unitType = unitType;
    }

    // Filter by availability status
    if (availabilityStatus) {
      query.availabilityStatus = availabilityStatus;
    }

    // Search by unit number
    if (search) {
      query.unitNumber = { $regex: search, $options: 'i' };
    }

    const units = await Unit.find(query)
      .populate('project', 'name builder location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: units.length,
      data: units
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single unit
// @route   GET /api/admin/units/:id
// @access  Private (Admin)
exports.getUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id)
      .populate('project', 'name builder location projectStatus');

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: unit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new unit
// @route   POST /api/admin/units
// @access  Private (Admin)
exports.createUnit = async (req, res) => {
  try {
    // Verify project exists
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!project.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create unit for inactive project'
      });
    }

    const unit = await Unit.create(req.body);

    // Populate project info
    await unit.populate('project', 'name builder location');

    // Update project totalUnits count
    const unitCount = await Unit.countDocuments({ project: project._id });
    await Project.findByIdAndUpdate(project._id, { totalUnits: unitCount });

    res.status(201).json({
      success: true,
      data: unit
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Unit with this number already exists in this project'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update unit
// @route   PUT /api/admin/units/:id
// @access  Private (Admin)
exports.updateUnit = async (req, res) => {
  try {
    // If project is being updated, verify it exists and is active
    if (req.body.project) {
      const project = await Project.findById(req.body.project);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      if (!project.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cannot assign unit to inactive project'
        });
      }
    }

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('project', 'name builder location');

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: unit
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Unit with this number already exists in this project'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete unit
// @route   DELETE /api/admin/units/:id
// @access  Private (Admin)
exports.deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    const projectId = unit.project;

    await unit.deleteOne();

    // Update project totalUnits count
    const unitCount = await Unit.countDocuments({ project: projectId });
    await Project.findByIdAndUpdate(projectId, { totalUnits: unitCount });

    res.status(200).json({
      success: true,
      message: 'Unit deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update unit availability status
// @route   PUT /api/admin/units/:id/availability
// @access  Private (Admin)
exports.updateAvailabilityStatus = async (req, res) => {
  try {
    const { availabilityStatus } = req.body;

    if (!['Available', 'Booked', 'Sold'].includes(availabilityStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability status'
      });
    }

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { availabilityStatus },
      {
        new: true,
        runValidators: true
      }
    ).populate('project', 'name builder location');

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: unit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Bulk update units
// @route   PUT /api/admin/units/bulk-update
// @access  Private (Admin)
exports.bulkUpdateUnits = async (req, res) => {
  try {
    const { unitIds, updateData } = req.body;

    if (!unitIds || !Array.isArray(unitIds) || unitIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide unit IDs array'
      });
    }

    const result = await Unit.updateMany(
      { _id: { $in: unitIds } },
      { $set: updateData },
      { runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} unit(s) updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

