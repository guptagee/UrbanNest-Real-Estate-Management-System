const Project = require('../models/Project');
const Builder = require('../models/Builder');
const Unit = require('../models/Unit');

/**
 * Project Controller
 * ADMIN ONLY - All project management operations are restricted to admin users
 * Projects represent builder/developer real estate projects
 */

// @desc    Get all projects
// @route   GET /api/admin/projects
// @access  Private (Admin)
exports.getAllProjects = async (req, res) => {
  try {
    const { builder, projectType, projectStatus, search, isActive, featured } = req.query;
    const query = {};

    // Filter by builder
    if (builder) {
      query.builder = builder;
    }

    // Filter by project type
    if (projectType) {
      query.projectType = projectType;
    }

    // Filter by project status
    if (projectStatus) {
      query.projectStatus = projectStatus;
    }

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Filter by featured status
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const projects = await Project.find(query)
      .populate('builder', 'name companyName logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/admin/projects/:id
// @access  Private (Admin)
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('builder', 'name companyName logo profile contact');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get unit count for this project
    const unitCount = await Unit.countDocuments({ project: project._id });
    project.totalUnits = unitCount;

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new project
// @route   POST /api/admin/projects
// @access  Private (Admin)
exports.createProject = async (req, res) => {
  try {
    // Verify builder exists
    const builder = await Builder.findById(req.body.builder);
    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    if (!builder.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create project for inactive builder'
      });
    }

    const project = await Project.create(req.body);

    // Populate builder info
    await project.populate('builder', 'name companyName logo');

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/admin/projects/:id
// @access  Private (Admin)
exports.updateProject = async (req, res) => {
  try {
    // If builder is being updated, verify it exists and is active
    if (req.body.builder) {
      const builder = await Builder.findById(req.body.builder);
      if (!builder) {
        return res.status(404).json({
          success: false,
          message: 'Builder not found'
        });
      }
      if (!builder.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cannot assign project to inactive builder'
        });
      }
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('builder', 'name companyName logo');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/admin/projects/:id
// @access  Private (Admin)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project has associated units
    const unitCount = await Unit.countDocuments({ project: project._id });
    if (unitCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete project. ${unitCount} unit(s) are associated with this project. Please delete units first.`
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle project active status
// @route   PUT /api/admin/projects/:id/toggle-status
// @access  Private (Admin)
exports.toggleProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.isActive = !project.isActive;
    await project.save();
    await project.populate('builder', 'name companyName logo');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle project featured status
// @route   PUT /api/admin/projects/:id/toggle-featured
// @access  Private (Admin)
exports.toggleFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.featured = !project.featured;
    await project.save();
    await project.populate('builder', 'name companyName logo');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

