const mongoose = require('mongoose');

/**
 * Project Model
 * Manages builder/developer real estate projects
 * ADMIN ONLY - Only admins can create/edit/delete projects
 */
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true
  },
  builder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Builder',
    required: [true, 'Please provide a builder']
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description']
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    landmark: {
      type: String,
      trim: true
    }
  },
  projectType: {
    type: String,
    enum: ['Residential', 'Commercial', 'Mixed'],
    required: [true, 'Please provide a project type']
  },
  projectStatus: {
    type: String,
    enum: ['New Launch', 'Under Construction', 'Ready'],
    required: [true, 'Please provide a project status'],
    default: 'New Launch'
  },
  possessionDate: {
    type: Date // Expected possession/completion date
  },
  totalUnits: {
    type: Number,
    default: 0,
    min: 0
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String, // Image URLs
    required: true
  }],
  brochures: [{
    name: String,
    url: String
  }],
  floorPlans: [{
    name: String,
    url: String,
    unitType: String // e.g., "2BHK", "3BHK"
  }],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
projectSchema.index({ builder: 1 });
projectSchema.index({ 'location.city': 1, 'location.state': 1 });
projectSchema.index({ projectType: 1 });
projectSchema.index({ projectStatus: 1 });
projectSchema.index({ isActive: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);

