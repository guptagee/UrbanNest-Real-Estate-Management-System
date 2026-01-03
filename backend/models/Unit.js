const mongoose = require('mongoose');

/**
 * Unit Model
 * Manages individual units/inventory under a project
 * ADMIN ONLY - Only admins can create/edit/delete units
 */
const unitSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Please provide a project'],
    index: true
  },
  unitNumber: {
    type: String, // e.g., "A-101", "Tower-A-502"
    required: [true, 'Please provide a unit number'],
    trim: true
  },
  unitType: {
    type: String,
    enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Shop', 'Office', 'Studio', 'Penthouse'],
    required: [true, 'Please provide a unit type']
  },
  area: {
    type: Number,
    required: [true, 'Please provide area size'],
    min: 0
  },
  areaUnit: {
    type: String,
    enum: ['sqft', 'sqm'],
    default: 'sqft'
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  pricePerUnit: {
    type: Number, // Price per sqft/sqm (calculated field)
    min: 0
  },
  bedrooms: {
    type: Number,
    default: 0,
    min: 0
  },
  bathrooms: {
    type: Number,
    default: 0,
    min: 0
  },
  balconies: {
    type: Number,
    default: 0,
    min: 0
  },
  floor: {
    type: String, // e.g., "5th Floor", "Ground Floor"
    trim: true
  },
  facing: {
    type: String, // e.g., "North", "South", "East", "West"
    trim: true
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Booked', 'Sold'],
    default: 'Available'
  },
  images: [{
    type: String // Unit-specific images
  }],
  floorPlan: {
    type: String // Floor plan image URL for this unit
  },
  notes: {
    type: String, // Additional notes about the unit
    trim: true
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
unitSchema.index({ project: 1, unitNumber: 1 }, { unique: true });
unitSchema.index({ project: 1 });
unitSchema.index({ unitType: 1 });
unitSchema.index({ availabilityStatus: 1 });
unitSchema.index({ price: 1 });
unitSchema.index({ createdAt: -1 });

// Calculate price per unit before saving
unitSchema.pre('save', function(next) {
  if (this.area && this.area > 0 && this.price) {
    this.pricePerUnit = Math.round((this.price / this.area) * 100) / 100;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Unit', unitSchema);

