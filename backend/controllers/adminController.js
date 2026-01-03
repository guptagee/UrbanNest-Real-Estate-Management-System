const User = require('../models/User');
const Admin = require('../models/Admin');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Report = require('../models/Report');
const Inquiry = require('../models/Inquiry');

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalProperties, totalBookings, revenue] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        {
          $lookup: {
            from: 'properties',
            localField: 'property',
            foreignField: '_id',
            as: 'propertyData'
          }
        },
        { $unwind: '$propertyData' },
        {
          $group: {
            _id: null,
            total: { $sum: '$propertyData.price' }
          }
        }
      ])
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const totalInquiries = await Inquiry.countDocuments();
    const inquiriesByStatus = await Inquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const totalReports = await Report.countDocuments();
    const reportsByStatus = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const propertiesByStatus = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProperties,
        totalBookings,
        revenue: revenue[0]?.total || 0,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        propertiesByStatus: propertiesByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalInquiries,
        inquiriesByStatus: inquiriesByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalReports,
        reportsByStatus: reportsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        pendingProperties: propertiesByStatus.find(p => p._id === 'pending')?.count || 0,
        pendingBookings: bookingsByStatus.find(b => b._id === 'pending')?.count || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users (excluding admins - admins are managed separately)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    const query = {};

    // Only get non-admin users (admins are in separate collection)
    if (role && role !== 'admin') {
      query.role = role;
    } else if (!role) {
      // If no role specified, exclude any remaining admin users from User collection
      query.role = { $ne: 'admin' };
    } else {
      // If role is 'admin', return empty (admins are in Admin collection)
      return res.status(200).json({
        success: true,
        count: 0,
        total: 0,
        page: Number(page),
        pages: 0,
        data: []
      });
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user (including role, isActive, blocked)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { role, isActive, blocked, ...updateData } = req.body;

    // Prevent setting role to 'admin' - admins are in separate Admin collection
    if (role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin role cannot be assigned through user management. Admins are managed separately.'
      });
    }

    // Prevent admin from deactivating or blocking themselves (for users only, not admins)
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updateFields = { ...updateData };
    if (role !== undefined && role !== 'admin') updateFields.role = role;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (blocked !== undefined) updateFields.blocked = blocked;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user or admin
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Check Admin collection first
    const admin = await Admin.findById(req.params.id);
    if (admin) {
      await Admin.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Admin deleted successfully'
      });
    }

    // Check User collection
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user's properties
    await Property.deleteMany({ owner: user._id });

    // Delete user's bookings
    await Booking.deleteMany({ user: user._id });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all properties (admin view)
// @route   GET /api/admin/properties
// @access  Private (Admin)
exports.getAllProperties = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .populate('agent', 'name email phone')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update property status (approve/reject)
// @route   PUT /api/admin/properties/:id/status
// @access  Private (Admin)
exports.updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['available', 'sold', 'rented', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('owner', 'name email').populate('agent', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/admin/properties/:id
// @access  Private (Admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Delete related bookings
    await Booking.deleteMany({ property: property._id });

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings (admin view)
// @route   GET /api/admin/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('property')
      .populate('user', 'name email phone')
      .populate('agent', 'name email phone')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.getAllReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('reporter', 'name email')
      .populate('property', 'title')
      .populate('targetUser', 'name email')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
// @access  Private (Admin)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'investigating', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
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

// @desc    Get all inquiries (admin view)
// @route   GET /api/admin/inquiries
// @access  Private (Admin)
exports.getAllInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title location price')
      .populate('user', 'name email phone')
      .populate('agent', 'name email phone')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Inquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/admin/inquiries/:id
// @access  Private (Admin)
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'contacted', 'converted', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('property', 'title').populate('user', 'name email').populate('agent', 'name email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
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

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('property', 'title').populate('user', 'name email').populate('agent', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};






