const mongoose = require('mongoose');

/**
 * Builder Model
 * Manages builder/company information
 * ADMIN ONLY - Only admins can create/edit/delete builders
 */
const builderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a builder name'],
    trim: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  profile: {
    type: String, // Company profile/about information
    trim: true
  },
  reraNumber: {
    type: String, // RERA registration number (optional)
    trim: true
  },
  contact: {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    }
  },
  logo: {
    type: String, // Logo image URL
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
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
builderSchema.index({ name: 1 });
builderSchema.index({ 'contact.email': 1 });
builderSchema.index({ isActive: 1 });
builderSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
builderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Builder', builderSchema);

