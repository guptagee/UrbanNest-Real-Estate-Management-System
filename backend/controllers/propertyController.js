const Property = require('../models/Property');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Inquiry = require('../models/Inquiry');

// Helper function to check property authorization
const isAuthorizedToAccessProperty = (property, userId, userRole) => {
  const isOwner = property.owner.toString() === userId;
  const isAssignedAgent = property.agent && property.agent.toString() === userId;
  const isAdmin = userRole === 'admin';
  return isOwner || isAssignedAgent || isAdmin;
};

// @desc    Get all properties with filtering and search
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const {
      search,
      propertyType,
      city,
      state,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      status,
      featured,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    if (propertyType) query.propertyType = propertyType;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (state) query['location.state'] = { $regex: state, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (status) query.status = status;
    if (featured === 'true') query.featured = true;

    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .populate('agent', 'name email phone')
      .sort(sort)
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

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('agent', 'name email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

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

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Agent/Admin)
exports.createProperty = async (req, res) => {
  try {
    req.body.owner = req.user.id;
    if (req.user.role === 'agent') {
      req.body.agent = req.user.id;
    }

    // Only admins can set featured status
    if (req.body.featured && req.user.role !== 'admin') {
      req.body.featured = false;
    }

    const property = await Property.create(req.body);

    res.status(201).json({
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

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner/Agent/Admin)
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check authorization
    if (!isAuthorizedToAccessProperty(property, req.user.id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    // Only admins can set featured status
    if (req.body.hasOwnProperty('featured') && req.user.role !== 'admin') {
      req.body.featured = property.featured; // Keep existing featured status
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

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
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership or admin (only owner or admin can delete)
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

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

// @desc    Get recommended properties for user
// @route   GET /api/properties/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const preferences = user.preferences || {};
    const searchHistory = user.searchHistory || [];

    // Build recommendation query based on preferences and search history
    const query = {
      status: 'available',
      _id: { $nin: searchHistory }
    };

    if (preferences.propertyType && preferences.propertyType.length > 0) {
      query.propertyType = { $in: preferences.propertyType };
    }

    if (preferences.priceRange) {
      query.price = {};
      if (preferences.priceRange.min) query.price.$gte = preferences.priceRange.min;
      if (preferences.priceRange.max) query.price.$lte = preferences.priceRange.max;
    }

    if (preferences.location && preferences.location.length > 0) {
      query['location.city'] = { $in: preferences.location };
    }

    if (preferences.bedrooms) {
      query.bedrooms = { $gte: preferences.bedrooms };
    }

    if (preferences.bathrooms) {
      query.bathrooms = { $gte: preferences.bathrooms };
    }

    // If no preferences, show featured properties
    if (Object.keys(query).length <= 2) {
      query.featured = true;
    }

    const recommendations = await Property.find(query)
      .populate('owner', 'name email phone')
      .populate('agent', 'name email phone')
      .sort('-featured -views -createdAt')
      .limit(10)
      .exec();

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle property availability
// @route   PUT /api/properties/:id/availability
// @access  Private (Owner/Agent/Admin)
exports.togglePropertyAvailability = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check authorization
    if (!isAuthorizedToAccessProperty(property, req.user.id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    // Toggle between available and pending
    const newStatus = property.status === 'available' ? 'pending' : 'available';
    property.status = newStatus;
    await property.save();

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

// @desc    Get property analytics
// @route   GET /api/properties/:id/analytics
// @access  Private (Owner/Agent/Admin)
exports.getPropertyAnalytics = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check authorization
    if (!isAuthorizedToAccessProperty(property, req.user.id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics for this property'
      });
    }

    // Get bookings count
    const bookingsCount = await Booking.countDocuments({ property: req.params.id });
    const confirmedBookings = await Booking.countDocuments({
      property: req.params.id,
      status: 'confirmed'
    });

    // Get inquiries count
    let inquiriesCount = 0;
    let newInquiries = 0;
    try {
      inquiriesCount = await Inquiry.countDocuments({ property: req.params.id });
      newInquiries = await Inquiry.countDocuments({
        property: req.params.id,
        status: 'new'
      });
    } catch (err) {
      // Inquiry model doesn't exist yet
    }

    const analytics = {
      views: property.views || 0,
      bookings: {
        total: bookingsCount,
        confirmed: confirmedBookings
      },
      inquiries: {
        total: inquiriesCount,
        new: newInquiries
      },
      createdAt: property.createdAt,
      lastUpdated: property.updatedAt
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get agent property statistics
// @route   GET /api/properties/agent/stats
// @access  Private (Agent/Admin)
exports.getAgentPropertyStats = async (req, res) => {
  try {
    const query = req.user.role === 'agent'
      ? { $or: [{ owner: req.user.id }, { agent: req.user.id }] }
      : {};

    const properties = await Property.find(query);

    const stats = {
      totalProperties: properties.length,
      available: properties.filter(p => p.status === 'available').length,
      sold: properties.filter(p => p.status === 'sold').length,
      rented: properties.filter(p => p.status === 'rented').length,
      pending: properties.filter(p => p.status === 'pending').length,
      totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
      featured: properties.filter(p => p.featured).length
    };

    // Get total bookings for agent properties
    const propertyIds = properties.map(p => p._id);
    const totalBookings = await Booking.countDocuments({
      property: { $in: propertyIds }
    });
    const confirmedBookings = await Booking.countDocuments({
      property: { $in: propertyIds },
      status: 'confirmed'
    });

    stats.bookings = {
      total: totalBookings,
      confirmed: confirmedBookings
    };

    // Get total inquiries
    try {
      const totalInquiries = await Inquiry.countDocuments({
        property: { $in: propertyIds }
      });
      const newInquiries = await Inquiry.countDocuments({
        property: { $in: propertyIds },
        status: 'new'
      });
      stats.inquiries = {
        total: totalInquiries,
        new: newInquiries
      };
    } catch (err) {
      stats.inquiries = { total: 0, new: 0 };
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

