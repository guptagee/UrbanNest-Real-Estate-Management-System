const mongoose = require('mongoose');

/**
 * Inquiry Model
 * Supports inquiries for both regular Properties and Builder Projects/Units
 * Users can inquire about properties OR projects/units
 */
const inquirySchema = new mongoose.Schema({
    // For regular property inquiries
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    // For builder project/unit inquiries
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inquiryType: {
        type: String,
        enum: ['property', 'project', 'unit'],
        required: true,
        default: 'property'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'converted', 'closed'],
        default: 'new'
    },
    contactPreference: {
        type: String,
        enum: ['email', 'phone', 'both'],
        default: 'both'
    },
    userEmail: {
        type: String,
        trim: true
    },
    userPhone: {
        type: String,
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

// Validation: Either property OR (project/unit) must be provided
inquirySchema.pre('validate', function(next) {
    if (!this.property && !this.project && !this.unit) {
        this.invalidate('property', 'Either property, project, or unit must be provided');
    }
    if (this.property && (this.project || this.unit)) {
        this.invalidate('property', 'Cannot have both property and project/unit');
    }
    next();
});

// Set inquiry type based on what's provided
inquirySchema.pre('save', function(next) {
    if (this.property) {
        this.inquiryType = 'property';
    } else if (this.unit) {
        this.inquiryType = 'unit';
    } else if (this.project) {
        this.inquiryType = 'project';
    }
    next();
});

// Indexes for better query performance
inquirySchema.index({ property: 1, createdAt: -1 });
inquirySchema.index({ project: 1, createdAt: -1 });
inquirySchema.index({ unit: 1, createdAt: -1 });
inquirySchema.index({ agent: 1, status: 1 });
inquirySchema.index({ user: 1 });
inquirySchema.index({ inquiryType: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
