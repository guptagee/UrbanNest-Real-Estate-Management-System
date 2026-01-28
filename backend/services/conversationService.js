const Conversation = require('../models/Conversation');
const Property = require('../models/Property');

class ConversationService {
  constructor() {
    this.CONVERSATION_STATES = {
      GREETING: 'greeting',
      GATHERING_REQUIREMENTS: 'gathering_requirements',
      SEARCHING: 'searching',
      SHOWING_RESULTS: 'showing_results',
      NEGOTIATING: 'negotiating',
      SCHEDULING_VISIT: 'scheduling_visit',
      FOLLOW_UP: 'follow_up'
    };

    this.INTENTS = {
      SEARCH_PROPERTY: 'search_property',
      GET_PROPERTY_DETAILS: 'get_property_details',
      NEGOTIATE_PRICE: 'negotiate_price',
      SCHEDULE_VISIT: 'schedule_visit',
      ASK_QUESTIONS: 'ask_questions',
      GENERAL_CHAT: 'general_chat'
    };
  }

  // Generate session ID for anonymous users
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create conversation
  async getOrCreateConversation(sessionId, userId = null) {
    return await Conversation.getOrCreateConversation(sessionId, userId);
  }

  // Analyze user message and extract intent and data
  analyzeMessage(message, conversation) {
    const lowerMessage = message.toLowerCase();

    // Platform/general question patterns (highest priority)
    const platformPatterns = [
      /\b(?:how\s+(?:do|can)\s+i|how\s+to)\s+(?:sign\s+up|register|create\s+account|join|get\s+started)/i,
      /\b(?:sign\s+up|register|signup|login|sign\s+in|create\s+account|join|membership)/i,
      /\b(?:what\s+is|how\s+does|tell\s+me\s+about)\s+(?:urbannest|this\s+platform|the\s+website)/i,
      /\b(?:contact|phone|email|address|support|help|customer\s+service)/i,
      /\b(?:how\s+it\s+works|how\s+does\s+it\s+work|getting\s+started|tutorial|guide)/i,
      /\b(?:about\s+us|company|who\s+are\s+you|what\s+do\s+you\s+do)/i,
      /\b(?:pricing|cost|fees|charges|payment|subscription)/i,
      /\b(?:features|services|what\s+can\s+you\s+do)/i
    ];

    // Property search patterns
    const searchPatterns = [
      /\b\d+\s*bhk/i,
      /\bapartment\b/i,
      /\bflat\b/i,
      /\bvilla\b/i,
      /\bhouse\b/i,
      /\bcommercial\b/i,
      /\bland\b/i,
      /\bplot\b/i,
      /\bunder\s+\d+(?:\.\d+)?\s*(?:cr|lakh|lacs|crs)/i,
      /\bbudget\s+\d+(?:\.\d+)?\s*(?:cr|lakh|lacs|crs)/i,
      /\b(?:find|show|search|get)\s+me\s+(?:a|an|some)/i,
      /\blooking\s+for/i,
      /\bwant\s+(?:to\s+)?(?:buy|purchase)/i,
      /\bin\s+[a-zA-Z\s]+(?:city|area|location)/i,
      /\bgym\b/i,
      /\bpool\b/i,
      /\bparking\b/i,
      /\bsecurity\b/i,
      /\bbalcony\b/i,
      /\bgarden\b/i
    ];

    // Property detail patterns
    const detailPatterns = [
      /\bshow\s+(?:me\s+)?(?:more\s+)?(?:details?|info)/i,
      /\btell\s+me\s+(?:more\s+)?about/i,
      /\bwhat\s+(?:is|are)\s+(?:the\s+)?details/i,
      /\bprice\s+(?:of|for)/i,
      /\bhow\s+much/i,
      /\bproperty\s+#?\d+/i,
      /\bthe\s+(?:first|second|third|1st|2nd|3rd)/i
    ];

    // Negotiation patterns
    const negotiationPatterns = [
      /\bnegotiate\b/i,
      /\bprice\s+(?:too\s+)?high/i,
      /\bcan\s+(?:we\s+)?(?:reduce|lower|decrease)/i,
      /\bbargain/i,
      /\boffer/i,
      /\bdiscount/i,
      /\bdeal/i
    ];

    // Visit scheduling patterns
    const visitPatterns = [
      /\bvisit\b/i,
      /\bsee\s+(?:the\s+)?property/i,
      /\bschedule\b/i,
      /\bappointment/i,
      /\bmeet/i,
      /\bwhen\s+can\s+i\s+see/i,
      /\barrange\s+(?:a\s+)?visit/i
    ];

    // Greeting patterns
    const greetingPatterns = [
      /\b(?:hello|hi|hey|greetings|good\s+(?:morning|afternoon|evening))/i,
      /\b(?:how\s+are\s+you|how\s+do\s+you\s+do)/i,
      /\b(?:nice\s+to\s+meet\s+you|pleased\s+to\s+meet)/i
    ];

    // Determine intent with priority order
    let intent = this.INTENTS.GENERAL_CHAT;
    let confidence = 0;

    // 1. Check for platform/general questions FIRST (highest priority)
    const platformMatches = platformPatterns.filter(pattern => pattern.test(lowerMessage)).length;
    if (platformMatches > 0) {
      intent = this.INTENTS.ASK_QUESTIONS;
      confidence = Math.min(platformMatches / platformPatterns.length, 1);
      console.log(`Platform question detected with ${platformMatches} matches`);
    }

    // 2. Check for greetings (if not already classified)
    if (intent === this.INTENTS.GENERAL_CHAT) {
      const greetingMatches = greetingPatterns.filter(pattern => pattern.test(lowerMessage)).length;
      if (greetingMatches > 0) {
        intent = this.INTENTS.GENERAL_CHAT;
        confidence = 0.8; // High confidence for greetings
      }
    }

    // 3. Check for property search intent
    if (intent === this.INTENTS.GENERAL_CHAT) {
      const searchMatches = searchPatterns.filter(pattern => pattern.test(lowerMessage)).length;
      if (searchMatches > 0) {
        intent = this.INTENTS.SEARCH_PROPERTY;
        confidence = Math.min(searchMatches / searchPatterns.length, 1);
        console.log(`Property search detected with ${searchMatches} matches`);
      }
    }

    // 4. Check for detail intent
    if (intent === this.INTENTS.GENERAL_CHAT) {
      const detailMatches = detailPatterns.filter(pattern => pattern.test(lowerMessage)).length;
      if (detailMatches > 0) {
        intent = this.INTENTS.GET_PROPERTY_DETAILS;
        confidence = Math.max(confidence, detailMatches / detailPatterns.length);
      }
    }

    // 5. Check for negotiation intent
    if (intent === this.INTENTS.GENERAL_CHAT) {
      const negotiationMatches = negotiationPatterns.filter(pattern => pattern.test(lowerMessage)).length;
      if (negotiationMatches > 0) {
        intent = this.INTENTS.NEGOTIATE_PRICE;
        confidence = 1; // High confidence for negotiation
      }
    }

    // 6. Check for visit scheduling intent
    if (intent === this.INTENTS.GENERAL_CHAT) {
      const visitMatches = visitPatterns.filter(pattern => pattern.test(lowerMessage)).length;
      if (visitMatches > 0) {
        intent = this.INTENTS.SCHEDULE_VISIT;
        confidence = visitMatches / visitPatterns.length;
      }
    }

    console.log(`Intent analysis: "${message}" -> ${intent} (confidence: ${confidence})`);

    // Extract data based on intent
    const extractedData = this.extractData(message, intent);

    return {
      intent,
      confidence,
      extractedData
    };
  }

  // Extract relevant data from message based on intent
  extractData(message, intent) {
    const data = {};

    // Price extraction
    const priceRegex = /(\d+(?:\.\d+)?)\s*(cr|lakh|lacs|crs)/gi;
    const prices = [];
    let match;
    while ((match = priceRegex.exec(message)) !== null) {
      const amount = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      let numericValue = amount;

      if (unit.includes('cr') || unit.includes('crs')) {
        numericValue = amount * 10000000; // Convert crores to rupees
      } else if (unit.includes('lakh') || unit.includes('lacs')) {
        numericValue = amount * 100000; // Convert lakhs to rupees
      }

      prices.push(numericValue);
    }

    if (prices.length > 0) {
      data.price = {
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices)
      };
    }

    // Location extraction
    const cityRegex = /\b(?:in|at|near)\s+([A-Z][a-zA-Z\s]+(?:city|area|location)?)/i;
    const cityMatch = message.match(cityRegex);
    if (cityMatch) {
      data.location = {
        city: cityMatch[1].trim()
      };
    }

    // BHK extraction
    const bhkRegex = /\b(\d+)\s*bhk/i;
    const bhkMatch = message.match(bhkRegex);
    if (bhkMatch) {
      data.bedrooms = parseInt(bhkMatch[1]);
    }

    // Property type extraction
    const typeMappings = {
      'apartment': 'apartment',
      'flat': 'flat',
      'villa': 'villa',
      'house': 'house',
      'commercial': 'commercial',
      'land': 'land',
      'plot': 'plot'
    };

    for (const [key, value] of Object.entries(typeMappings)) {
      if (message.toLowerCase().includes(key)) {
        data.propertyType = value;
        break;
      }
    }

    // Amenities extraction
    const amenityMappings = {
      'gym': 'gym',
      'pool': 'pool',
      'swimming pool': 'pool',
      'parking': 'parking',
      'security': 'security',
      'garden': 'garden',
      'lift': 'lift',
      'elevator': 'lift',
      'balcony': 'balcony',
      'terrace': 'terrace'
    };

    const amenities = [];
    for (const [key, value] of Object.entries(amenityMappings)) {
      if (message.toLowerCase().includes(key)) {
        amenities.push(value);
      }
    }

    if (amenities.length > 0) {
      data.amenities = amenities;
    }

    return data;
  }

  // Update conversation state based on intent and data
  updateConversationState(conversation, intent, extractedData) {
    const currentState = conversation.conversationState;

    switch (intent) {
      case this.INTENTS.ASK_QUESTIONS:
        // Platform questions don't change the main conversation state
        // Keep current state or set to general if greeting
        if (currentState === this.CONVERSATION_STATES.GREETING) {
          conversation.conversationState = this.CONVERSATION_STATES.GATHERING_REQUIREMENTS;
        }
        break;

      case this.INTENTS.SEARCH_PROPERTY:
        if (Object.keys(extractedData).length > 0) {
          conversation.conversationState = this.CONVERSATION_STATES.SEARCHING;
        } else {
          conversation.conversationState = this.CONVERSATION_STATES.GATHERING_REQUIREMENTS;
        }
        break;

      case this.INTENTS.GET_PROPERTY_DETAILS:
        conversation.conversationState = this.CONVERSATION_STATES.SHOWING_RESULTS;
        break;

      case this.INTENTS.NEGOTIATE_PRICE:
        conversation.conversationState = this.CONVERSATION_STATES.NEGOTIATING;
        break;

      case this.INTENTS.SCHEDULE_VISIT:
        conversation.conversationState = this.CONVERSATION_STATES.SCHEDULING_VISIT;
        break;

      default:
        if (currentState === this.CONVERSATION_STATES.GREETING) {
          conversation.conversationState = this.CONVERSATION_STATES.GATHERING_REQUIREMENTS;
        }
    }

    // Update user preferences with extracted data (only for property-related intents)
    if (intent !== this.INTENTS.ASK_QUESTIONS) {
      if (extractedData.price) {
        conversation.userPreferences.budget = {
          ...conversation.userPreferences.budget,
          ...extractedData.price
        };
      }

      if (extractedData.location) {
        conversation.userPreferences.location = {
          ...conversation.userPreferences.location,
          ...extractedData.location
        };
      }

      if (extractedData.propertyType) {
        conversation.userPreferences.propertyType = extractedData.propertyType;
      }

      if (extractedData.bedrooms) {
        conversation.userPreferences.bedrooms = extractedData.bedrooms;
      }

      if (extractedData.amenities) {
        conversation.userPreferences.amenities = [
          ...(conversation.userPreferences.amenities || []),
          ...extractedData.amenities
        ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
      }
    }

    return conversation;
  }

  // Generate intelligent response based on conversation context
  async generateResponse(conversation, intent, extractedData, message) {
    // Handle specific intents first, regardless of conversation state
    switch (intent) {
      case this.INTENTS.ASK_QUESTIONS:
        return this.generatePlatformQuestionsResponse(message);

      case this.INTENTS.SEARCH_PROPERTY:
        conversation.conversationState = this.CONVERSATION_STATES.SEARCHING;
        return await this.generateSearchResponse(conversation, extractedData);

      case this.INTENTS.GET_PROPERTY_DETAILS:
        conversation.conversationState = this.CONVERSATION_STATES.SHOWING_RESULTS;
        return this.generateDetailsResponse(conversation, extractedData);

      case this.INTENTS.NEGOTIATE_PRICE:
        conversation.conversationState = this.CONVERSATION_STATES.NEGOTIATING;
        return this.generateNegotiationResponse(conversation, extractedData);

      case this.INTENTS.SCHEDULE_VISIT:
        conversation.conversationState = this.CONVERSATION_STATES.SCHEDULING_VISIT;
        return this.generateVisitSchedulingResponse(conversation, extractedData);
    }

    // Handle conversation state-based responses
    switch (conversation.conversationState) {
      case this.CONVERSATION_STATES.GREETING:
        return this.generateGreetingResponse();

      case this.CONVERSATION_STATES.GATHERING_REQUIREMENTS:
        return this.generateRequirementsResponse(conversation, extractedData);

      case this.CONVERSATION_STATES.SEARCHING:
        return await this.generateSearchResponse(conversation, extractedData);

      case this.CONVERSATION_STATES.SHOWING_RESULTS:
        return this.generateDetailsResponse(conversation, extractedData);

      case this.CONVERSATION_STATES.NEGOTIATING:
        return this.generateNegotiationResponse(conversation, extractedData);

      case this.CONVERSATION_STATES.SCHEDULING_VISIT:
        return this.generateVisitSchedulingResponse(conversation, extractedData);

      default:
        return this.generateGeneralResponse(message);
    }
  }

  generateGreetingResponse() {
    return {
      type: 'greeting',
      content: `Hello! I'm your AI real estate assistant at Urbannest. I can help you find the perfect property in Rajkot and surrounding areas.

What are you looking for today?
• 🏠 Buy a property
• 🏢 Commercial space
• 📍 Specific location or budget
• ❓ General questions about real estate

Just tell me what you're interested in, and I'll guide you through the process!`
    };
  }

  generateRequirementsResponse(conversation, extractedData) {
    const preferences = conversation.userPreferences;
    const missing = [];

    if (!preferences.budget?.maxPrice) missing.push('budget range');
    if (!preferences.location?.city) missing.push('preferred location');
    if (!preferences.propertyType) missing.push('property type');
    if (!preferences.bedrooms) missing.push('number of bedrooms');

    if (missing.length > 0) {
      return {
        type: 'gathering_info',
        content: `I'd love to help you find the perfect property! To give you the best recommendations, could you please share:

${missing.map(item => `• Your ${item}`).join('\n')}

For example: "I'm looking for a 3BHK apartment in Rajkot under 80 lakhs with parking"

What are your preferences?`
      };
    } else {
      return {
        type: 'ready_to_search',
        content: `Perfect! Based on our conversation, you're looking for:
• ${preferences.bedrooms}BHK ${preferences.propertyType}
• Budget: ${this.formatPriceRange(preferences.budget)}
• Location: ${preferences.location?.city || 'Any'}
• Amenities: ${preferences.amenities?.join(', ') || 'Any'}

Let me search for matching properties for you!`
      };
    }
  }

  async generateSearchResponse(conversation, extractedData) {
    const preferences = { ...conversation.userPreferences, ...extractedData };

    // Build search query
    const query = { status: 'available' };

    if (preferences.propertyType) query.propertyType = preferences.propertyType;
    if (preferences.location?.city) {
      query['location.city'] = { $regex: preferences.location.city, $options: 'i' };
    }
    if (preferences.bedrooms) query.bedrooms = { $gte: preferences.bedrooms };
    if (preferences.budget?.maxPrice) query.price = { $lte: preferences.budget.maxPrice };
    if (preferences.budget?.minPrice && !query.price) query.price = { $gte: preferences.budget.minPrice };
    if (preferences.amenities?.length > 0) {
      query.amenities = { $in: preferences.amenities.map(a => new RegExp(a, 'i')) };
    }

    const properties = await Property.find(query)
      .populate('owner', 'name phone')
      .populate('agent', 'name phone')
      .limit(5)
      .sort({ createdAt: -1 });

    if (properties.length === 0) {
      return {
        type: 'no_results',
        content: `I searched for ${preferences.bedrooms || 'any'}BHK ${preferences.propertyType || 'properties'} ${preferences.location?.city ? `in ${preferences.location.city}` : ''} ${preferences.budget?.maxPrice ? `under ${this.formatPrice(preferences.budget.maxPrice)}` : ''}, but couldn't find any exact matches.

Would you like me to:
• 🔍 Expand your search criteria
• 📍 Look in nearby areas
• 💰 Adjust your budget range
• 🏠 Show similar properties

What would you prefer?`
      };
    }

    // Format property results
    let content = `Great! I found ${properties.length} matching properties:\n\n`;

    properties.forEach((prop, index) => {
      content += `${index + 1}. **${prop.title}**\n`;
      content += `   📍 ${prop.location.address}, ${prop.location.city}\n`;
      content += `   💰 ${this.formatPrice(prop.price)}\n`;
      content += `   🛏️ ${prop.bedrooms || 0} BHK, 🛁 ${prop.bathrooms || 0} bathrooms\n`;
      content += `   📐 ${prop.area} ${prop.areaUnit}\n`;
      if (prop.amenities && prop.amenities.length > 0) {
        content += `   🏊 Amenities: ${prop.amenities.slice(0, 3).join(', ')}${prop.amenities.length > 3 ? '...' : ''}\n`;
      }
      content += `   📞 Contact: ${prop.agent?.name || prop.owner?.name || 'Agent'}\n`;
      content += `   🔗 View details: /properties/${prop._id}\n\n`;
    });

    content += `Would you like to:\n• 📋 Get more details about any of these properties\n• 🔍 Search for more options\n• 📅 Schedule a visit to see one of these properties\n\nWhich property interests you most? (1-${properties.length})`;

    return {
      type: 'search_results',
      content,
      properties: properties.map(p => ({
        id: p._id,
        title: p.title,
        price: p.price,
        location: p.location,
        bedrooms: p.bedrooms
      }))
    };
  }

  generateDetailsResponse(conversation, extractedData) {
    return {
      type: 'property_details',
      content: `I'd be happy to provide more details! Which property are you interested in learning more about? Please tell me the property number (1-5) from the list above, or describe what you're looking for.`
    };
  }

  generateNegotiationResponse(conversation, extractedData) {
    return {
      type: 'negotiation',
      content: `I understand you're interested in negotiating the price. For properties in Rajkot, prices are often negotiable by 5-10% depending on the property and market conditions.

Would you like me to:
• 📞 Connect you with the property agent to discuss pricing
• 💰 Show you comparable properties in the same price range
• 📊 Provide market analysis for the area

Which property would you like to negotiate for?`
    };
  }

  generateVisitSchedulingResponse(conversation, extractedData) {
    return {
      type: 'visit_scheduling',
      content: `Excellent! Scheduling a property visit is a great next step. Here's how we can arrange it:

**Next Steps:**
1. 📅 Choose your preferred date and time
2. 📍 Confirm which property you'd like to visit
3. 👥 I'll connect you with the property agent
4. 🏠 Arrange transportation if needed

**Popular Visiting Times:**
• Weekdays: 10 AM - 6 PM
• Weekends: 9 AM - 7 PM
• Evenings: 4 PM - 8 PM

Which property would you like to visit, and what day/time works best for you?`
    };
  }

  generatePlatformQuestionsResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Handle signup/registration questions
    if (lowerMessage.includes('sign up') || lowerMessage.includes('register') || lowerMessage.includes('signup') ||
        lowerMessage.includes('create account') || lowerMessage.includes('join') || lowerMessage.includes('how to')) {
      return {
        type: 'platform_info',
        content: `Great question! Here's how to sign up on Urbannest:

**📝 How to Create an Account:**

1. **Click "Start for free"** in the top-right corner of any page
2. **Choose your account type:**
   • **User**: For property buyers and renters
   • **Agent**: For real estate professionals
3. **Fill in your details:**
   • Full name
   • Email address
   • Phone number
   • Create a password
4. **Verify your email** (check your inbox for verification link)
5. **Complete your profile** with additional information

**🎯 Benefits of Signing Up:**
• Save favorite properties
• Get personalized recommendations
• Schedule property visits
• Receive price alerts
• Access exclusive deals

**🔐 Account Types:**
• **Free Account**: Basic property search and saving
• **Premium**: Advanced features (coming soon)

Would you like me to help you find properties first, or do you have questions about the signup process?`
      };
    }

    // Handle contact/support questions
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') ||
        lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return {
        type: 'contact_info',
        content: `Here's how to get in touch with Urbannest:

**📞 Contact Information:**
• **Email**: support@urbannest.com
• **Phone**: +91 98765 43210
• **Address**: 150 Feet Ring Road, Rajkot, Gujarat, India 360005

**💬 Support Hours:**
• Monday - Saturday: 9:00 AM - 8:00 PM IST
• Sunday: 10:00 AM - 5:00 PM IST

**🚀 Other Ways to Connect:**
• **Live Chat**: I'm here to help right now!
• **Website**: Visit urbannest.com for more information
• **Social Media**: Follow us for updates and tips

**❓ Common Questions:**
• Property valuation assistance
• Legal document guidance
• Loan and financing help
• Market trend analysis

How can I assist you today?`
      };
    }

    // Handle "how it works" questions
    if (lowerMessage.includes('how it works') || lowerMessage.includes('how does it work') ||
        lowerMessage.includes('getting started') || lowerMessage.includes('tutorial')) {
      return {
        type: 'how_it_works',
        content: `Here's how Urbannest works to help you find your perfect property:

**🏠 For Property Seekers:**

1. **Sign Up** (free) to create your profile
2. **Tell us your requirements** (budget, location, property type, etc.)
3. **Browse personalized recommendations** or search manually
4. **Save favorite properties** to compare them easily
5. **Contact agents directly** through our platform
6. **Schedule property visits** and get guided tours
7. **Get assistance** with paperwork, loans, and closing

**👨‍💼 For Real Estate Agents:**

1. **Register as an Agent** to list your properties
2. **Add property listings** with photos, details, and pricing
3. **Manage inquiries** from interested buyers
4. **Schedule property visits** and showings
5. **Track leads** and conversion rates
6. **Access analytics** to improve your listings

**🤖 AI-Powered Features:**
• **Smart Search**: Describe what you want in plain English
• **Personalized Recommendations**: Based on your preferences
• **Market Insights**: Real-time pricing and trend data
• **Virtual Tours**: 360° property views (coming soon)

**💡 Pro Tips:**
• Be specific about your requirements for better matches
• Upload multiple high-quality photos for listings
• Respond quickly to inquiries for better conversion
• Use our AI chat for instant property questions

What would you like to explore first?`
      };
    }

    // Handle about us questions
    if (lowerMessage.includes('about us') || lowerMessage.includes('about urbannest') ||
        lowerMessage.includes('who are you') || lowerMessage.includes('company')) {
      return {
        type: 'about_info',
        content: `🌟 **About Urbannest**

**🏢 Who We Are:**
Urbannest is India's modern real estate platform, connecting property buyers, sellers, and real estate professionals in a seamless digital experience.

**🎯 Our Mission:**
To revolutionize the real estate industry by making property search, buying, and selling transparent, efficient, and accessible to everyone.

**💡 What Makes Us Different:**

• **🤖 AI-Powered Search**: Describe your dream home in plain English
• **📱 Modern Technology**: Intuitive mobile-first design
• **🔒 Verified Listings**: All properties are verified for authenticity
• **📊 Market Intelligence**: Real-time pricing and trend analysis
• **👥 Personal Service**: Dedicated support throughout your journey
• **🌍 Local Expertise**: Deep knowledge of Rajkot and Gujarat markets

**📈 Our Impact:**
• 1000+ Happy Customers
• 500+ Properties Listed
• 50+ Partner Agents
• 4.8/5 Customer Satisfaction Rating

**🌟 Our Values:**
• **Transparency**: Clear pricing, no hidden fees
• **Innovation**: Cutting-edge technology for better experience
• **Trust**: Verified agents and authentic listings
• **Accessibility**: Simple, user-friendly platform for everyone

**📍 Service Areas:**
• Rajkot (primary focus)
• Ahmedabad
• Surat
• Vadodara
• Other Gujarat cities (expanding)

Ready to start your property journey with us? I can help you find the perfect property or guide you through our platform!`
      };
    }

    // Handle pricing/features questions
    if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('fees') ||
        lowerMessage.includes('features') || lowerMessage.includes('services')) {
      return {
        type: 'pricing_info',
        content: `Here's information about Urbannest's features and pricing:

**💰 Pricing Structure:**

**Free Services:**
• ✅ Property search and browsing
• ✅ Save favorite properties
• ✅ Basic property inquiries
• ✅ AI chat assistance
• ✅ Market price estimates
• ✅ Property comparison tools

**Premium Features (Coming Soon):**
• ⭐ Advanced search filters
• ⭐ Priority customer support
• ⭐ Virtual property tours
• ⭐ Investment analysis reports
• ⭐ Legal document assistance
• ⭐ Loan pre-approval services

**Agent Services:**
• 🏠 Property listing: ₹499/month per listing
• 📊 Advanced analytics: ₹999/month
• 🎯 Lead generation tools: ₹1999/month
• 📞 Priority support: ₹2999/month

**🏆 Key Features:**

**For Buyers:**
• 🤖 AI-powered property matching
• 📱 Mobile-optimized search
• 💾 Unlimited property saves
• 📧 Price alert notifications
• 📞 Direct agent contact
• 📅 Visit scheduling
• 📋 Document checklist
• 💳 EMI calculator

**For Agents:**
• 📝 Easy property listing
• 📊 Lead management dashboard
• 📈 Performance analytics
• 🎯 Targeted buyer matching
• 📞 Integrated communication
• 📅 Visit scheduling system
• 🏷️ Property promotion tools

**🔧 Platform Features:**
• 🛡️ Secure payment processing
• 📱 Cross-platform compatibility
• 🌐 Multi-language support (Hindi, English, Gujarati)
• 📊 Real-time market data
• 🤝 Verified user reviews
• 🔔 Push notifications

Would you like me to show you how to use any of these features, or help you find properties that match your needs?`
      };
    }

    // Default platform response
    return {
      type: 'platform_general',
      content: `I'm here to help you with all aspects of Urbannest! Whether you have questions about:

**🏠 Property Search & Buying:**
• Finding properties that match your criteria
• Understanding market prices and trends
• Getting help with the buying process

**👤 Account & Platform:**
• How to sign up and create an account
• Platform features and pricing
• Account management and settings

**📞 Support & Contact:**
• Getting help with technical issues
• Contacting our support team
• General platform questions

**🤝 Agent Services:**
• How to list properties (for agents)
• Managing your listings
• Lead generation and analytics

What specific question can I help you with today? Just ask, and I'll provide detailed information!`
    };
  }

  generateGeneralResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Handle thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return {
        type: 'gratitude_response',
        content: `You're very welcome! I'm glad I could help. 

Is there anything else I can assist you with today? Whether it's:
• 🏠 Finding more properties
• ❓ Answering questions about the platform
• 📅 Scheduling property visits
• 💬 General real estate advice

I'm here whenever you need me! 😊`
      };
    }

    // Handle yes/no responses in context
    if (lowerMessage.match(/^(yes|yeah|yep|sure|okay|ok|alright)/i)) {
      return {
        type: 'affirmative_response',
        content: `Great! What would you like to do next? I can help you with:

• 🏠 **Property Search**: Tell me your requirements (budget, location, type)
• 📋 **More Details**: Ask about specific properties
• 📅 **Visit Scheduling**: Arrange property viewings
• ❓ **Questions**: Ask anything about real estate or our platform

What interests you most?`
      };
    }

    if (lowerMessage.match(/^(no|nope|nah|not really)/i)) {
      return {
        type: 'negative_response',
        content: `No problem at all! Take your time to think about what you're looking for.

When you're ready, I'm here to help with:
• 🏠 Property search and recommendations
• 📊 Market insights and pricing
• ❓ General real estate questions
• 🛠️ Platform features and how-to guides

Just let me know when you'd like to continue!`
      };
    }

    // Default general response
    return {
      type: 'general',
      content: `I'm here to help with all your real estate needs on Urbannest! Whether you're looking to buy, sell, or just have questions about the Rajkot property market, I can assist you.

Some popular things I can help with:
• 🏠 Finding properties that match your requirements
• 💰 Understanding current market prices and trends
• 📋 Answering questions about the buying/selling process
• 🏢 Commercial property information
• 📰 Real estate market updates and insights
• ❓ General questions about our platform

What would you like to know more about? Just describe what you're interested in!`
    };
  }

  // Utility functions
  formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatPriceRange(budget) {
    if (budget.minPrice && budget.maxPrice) {
      return `${this.formatPrice(budget.minPrice)} - ${this.formatPrice(budget.maxPrice)}`;
    } else if (budget.maxPrice) {
      return `Up to ${this.formatPrice(budget.maxPrice)}`;
    } else if (budget.minPrice) {
      return `From ${this.formatPrice(budget.minPrice)}`;
    }
    return 'Any budget';
  }
}

module.exports = new ConversationService();
