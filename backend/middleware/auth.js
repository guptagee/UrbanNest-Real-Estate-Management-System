const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check Admin collection first
    let admin = await Admin.findById(decoded.id).select('-password');
    if (admin) {
      req.user = admin;
      req.user.role = 'admin'; // Add role for compatibility
      req.userType = 'admin';
      return next();
    }
    
    // Check User collection
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
      req.user.role = user.role; // Add role for authorization middleware
      req.userType = 'user';
      return next();
    }
    
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Admin always has access if roles include 'admin'
    if (roles.includes('admin') && req.userType === 'admin') {
      return next();
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

