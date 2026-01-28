const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  userPreferences: {
    budget: {
      minPrice: Number,
      maxPrice: Number
    },
    location: {
      city: String,
      areas: [String],
      state: String
    },
    propertyType: String,
    bedrooms: Number,
    bathrooms: Number,
    amenities: [String],
    propertySize: {
      minArea: Number,
      maxArea: Number,
      unit: {
        type: String,
        enum: ['sqft', 'sqm'],
        default: 'sqft'
      }
    },
    urgency: {
      type: String,
      enum: ['immediate', 'within_month', 'within_3_months', 'just_looking'],
      default: 'just_looking'
    },
    purpose: {
      type: String,
      enum: ['investment', 'self_use', 'rental_income', 'vacation_home'],
      default: 'self_use'
    }
  },
  conversationState: {
    type: String,
    enum: ['greeting', 'gathering_requirements', 'searching', 'showing_results', 'negotiating', 'scheduling_visit', 'follow_up'],
    default: 'greeting'
  },
  messageHistory: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    intent: String, // 'search', 'inquire', 'negotiate', 'book_visit', etc.
    extractedData: mongoose.Schema.Types.Mixed, // Store extracted information
    suggestedProperties: [{
      propertyId: mongoose.Schema.Types.ObjectId,
      relevanceScore: Number
    }]
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  propertiesViewed: [{
    propertyId: mongoose.Schema.Types.ObjectId,
    viewedAt: Date,
    interested: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
conversationSchema.index({ sessionId: 1, lastActivity: -1 });
conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ 'userPreferences.location.city': 1 });
conversationSchema.index({ conversationState: 1 });

// Update the updatedAt field before saving
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  this.lastActivity = new Date();
  next();
});

// Clean up old conversations (older than 30 days)
conversationSchema.statics.cleanupOldConversations = async function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    lastActivity: { $lt: thirtyDaysAgo },
    isActive: false
  });
};

// Get or create conversation for session
conversationSchema.statics.getOrCreateConversation = async function(sessionId, userId = null) {
  let conversation = await this.findOne({
    sessionId,
    isActive: true
  }).sort({ updatedAt: -1 });

  if (!conversation) {
    conversation = new this({
      sessionId,
      userId,
      conversationState: 'greeting',
      messageHistory: [{
        role: 'assistant',
        content: 'Hello! I am your AI assistant. How can I help you find your dream property today?',
        intent: 'greeting'
      }]
    });
    await conversation.save();
  }

  return conversation;
};

module.exports = mongoose.model('Conversation', conversationSchema);
