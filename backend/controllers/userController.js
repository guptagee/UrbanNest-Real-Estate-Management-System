const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.preferences = {
      ...user.preferences,
      ...req.body
    };

    await user.save();

    res.status(200).json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add property to search history
// @route   POST /api/users/search-history
// @access  Private
exports.addToSearchHistory = async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Add to history if not already present
    if (!user.searchHistory.includes(propertyId)) {
      user.searchHistory.push(propertyId);
      // Keep only last 50 properties
      if (user.searchHistory.length > 50) {
        user.searchHistory = user.searchHistory.slice(-50);
      }
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Property added to search history'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

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

// @desc    Get user's properties (for agents/owners)
// @route   GET /api/users/my-properties
// @access  Private
exports.getMyProperties = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'agent') {
      query.$or = [
        { owner: req.user.id },
        { agent: req.user.id }
      ];
    } else {
      query.owner = req.user.id;
    }

    const properties = await Property.find(query)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle favorite property
// @route   POST /api/users/favorites
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const user = await User.findById(req.user.id);
    const favoriteIndex = user.favorites.findIndex(
      fav => fav.toString() === propertyId.toString()
    );

    if (favoriteIndex > -1) {
      // Remove from favorites
      user.favorites.splice(favoriteIndex, 1);
      await user.save();
      res.status(200).json({
        success: true,
        isFavorite: false,
        message: 'Property removed from favorites'
      });
    } else {
      // Add to favorites
      user.favorites.push(propertyId);
      await user.save();
      res.status(200).json({
        success: true,
        isFavorite: true,
        message: 'Property added to favorites'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's favorite properties
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.favorites || user.favorites.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    const properties = await Property.find({
      _id: { $in: user.favorites }
    })
      .populate('owner', 'name email phone')
      .populate('agent', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

