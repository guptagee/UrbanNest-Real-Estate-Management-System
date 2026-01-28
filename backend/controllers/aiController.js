const OpenAI = require('openai');
const Property = require('../models/Property');
const Conversation = require('../models/Conversation');
const conversationService = require('../services/conversationService');

// Lazy initialization of OpenAI client
let openai = null;

const getOpenAIClient = () => {
  if (!openai && process.env.GEMINI_API_KEY) {
    openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.GEMINI_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173", // Site URL for OpenRouter rankings
        "X-Title": "REMS", // Site title
      }
    });
  }
  return openai;
};

const MODELS = [
  "google/gemini-2.0-flash-001",
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "google/gemini-pro-1.5",
  "google/gemini-pro"
];

// Helper to try models
const generateWithOpenRouter = async (messages, jsonMode = false, client = null) => {
  const openaiClient = client || getOpenAIClient();
  if (!openaiClient) {
    throw new Error("OpenAI client not available");
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      const completion = await openaiClient.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.7,
        response_format: jsonMode ? { type: "json_object" } : undefined
      });

      return completion.choices[0].message.content;

    } catch (error) {
      console.log(`OpenRouter Model ${model} failed: ${error.message}`);
      // If unauthorized, no point trying other models with same key
      if (error.status === 401) throw error;
      lastError = error;
    }
  }
  throw lastError || new Error("All OpenRouter models failed");
};

// FEATURE 1: AI CHATBOT
const chatWithAI = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Generate session ID if not provided (for anonymous users)
    const finalSessionId = sessionId || conversationService.generateSessionId();

    // Get or create conversation
    const conversation = await conversationService.getOrCreateConversation(finalSessionId, req.user?.id);

    // Analyze the user message
    const analysis = conversationService.analyzeMessage(message, conversation);

    // Update conversation state and preferences
    conversationService.updateConversationState(conversation, analysis.intent, analysis.extractedData);

    // Add user message to conversation history
    conversation.messageHistory.push({
      role: 'user',
      content: message,
      intent: analysis.intent,
      extractedData: analysis.extractedData,
      timestamp: new Date()
    });

    // Generate intelligent response
    const response = await conversationService.generateResponse(
      conversation,
      analysis.intent,
      analysis.extractedData,
      message
    );

    // Add assistant response to conversation history
    conversation.messageHistory.push({
      role: 'assistant',
      content: response.content,
      intent: analysis.intent,
      suggestedProperties: response.properties?.map(p => ({
        propertyId: p.id,
        relevanceScore: 1
      })) || [],
      timestamp: new Date()
    });

    conversation.totalMessages += 1;

    // Save conversation
    await conversation.save();

    res.status(200).json({
      reply: response.content,
      sessionId: finalSessionId,
      conversationState: conversation.conversationState,
      type: response.type,
      properties: response.properties || []
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      message: 'Failed to get AI response',
      error: error.message,
      reply: "I'm sorry, I'm experiencing some technical difficulties right now. Please try again in a moment, or contact our support team for immediate assistance."
    });
  }
};

// FEATURE 2: PROPERTY DESCRIPTION GENERATOR
const generatePropertyDescription = async (req, res) => {
  try {
    const { propertyType, location, area, bedrooms, bathrooms, price, amenities } = req.body;

    // Validate minimum required fields
    if (!propertyType || !location || !price) {
        return res.status(400).json({ message: 'Missing required property details' });
    }

    const client = getOpenAIClient();
    if (!client) {
      return res.status(503).json({ message: 'API key not configured' });
    }

    const amenitiesList = Array.isArray(amenities) ? amenities.join(', ') : amenities;
    const locationStr = typeof location === 'object' 
      ? `${location.address || ''}, ${location.city || ''}, ${location.state || ''}` 
      : location;

    const prompt = `
      Write a professional real estate property description based on these details:
      - Type: ${propertyType}
      - Location: ${locationStr}
      - Size: ${area}
      - Bedrooms: ${bedrooms}
      - Bathrooms: ${bathrooms}
      - Price: ${price}
      - Amenities: ${amenitiesList}

      Rules:
      - Tone: Professional and inviting
      - Length: 80–120 words
      - NO emojis
      - NO exaggeration (stick to facts provided)
      - Suitable for a real estate listing
    `;

    const messages = [
      { role: "system", content: "You are a professional real estate copywriter." },
      { role: "user", content: prompt }
    ];

    const description = await generateWithOpenRouter(messages, false, client);
    res.status(200).json({ description });

  } catch (error) {
    console.error('AI Description Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate description', 
      error: error.message 
    });
  }
};

// FEATURE 3: AI RECOMMENDATION ENGINE
const recommendProperties = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const client = getOpenAIClient();
    if (!client) {
      return res.status(503).json({ message: 'API key not configured' });
    }

    // Step 1: Extract filters from natural language
    const extractionPrompt = `
      Extract search filters from this user query for a real estate database: "${query}"
      
      Return a JSON object with these keys (use null if not mentioned):
      - type: string (one of: 'house', 'apartment', 'flat', 'villa', 'land', 'commercial', 'plot')
      - minPrice: number (in INR)
      - maxPrice: number (in INR)
      - city: string (city name only)
      - minBedrooms: number
      - amenities: array of strings (keywords like 'pool', 'gym', 'parking')

      Example input: "3bhk flat in Mumbai under 2 crores with pool"
      Example output: {"type": "flat", "minPrice": null, "maxPrice": 20000000, "city": "Mumbai", "minBedrooms": 3, "amenities": ["pool"]}
    `;

    const messages = [
      { role: "system", content: "You are a JSON extractor. Output valid JSON only. No markdown." },
      { role: "user", content: extractionPrompt }
    ];

    // Note: jsonMode=true is supported by some models, but we'll parse manually to be safe across models
    let jsonStr = await generateWithOpenRouter(messages, true, client);
    
    // Cleanup markdown code blocks if present
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let filters;
    try {
        filters = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse AI JSON:", jsonStr);
        return res.status(500).json({ message: "Failed to understand query" });
    }

    console.log("Extracted Filters:", filters);

    // Step 2: Build MongoDB Query
    const dbQuery = { status: 'available' }; // Only show available properties

    if (filters.type) {
        let type = filters.type.toLowerCase();
        // Handle common variations if AI misses the strict enum instructions
        if (type.includes('villa')) type = 'villa';
        else if (type.includes('apartment') || type.includes('flat')) type = 'apartment'; // normalized to apartment if that's what DB uses? 
        // Wait, the schema has both 'apartment' and 'flat'. Let's keep them distinct or map as needed.
        // Schema enum: ['house', 'apartment', 'flat', 'villa', 'land', 'commercial', 'plot']
        
        // If the AI returns "independent villa", this cleaning ensures we just get "villa" if we want strict matching,
        // or strictly map to valid enums.
        const validTypes = ['house', 'apartment', 'flat', 'villa', 'land', 'commercial', 'plot'];
        
        if (validTypes.includes(type)) {
             dbQuery.propertyType = type;
        } else {
            // Try to find partial match
            const match = validTypes.find(t => type.includes(t));
            if (match) dbQuery.propertyType = match;
        }
    }

    if (filters.city) {
        // Use a more flexible regex for city to handle partial matches or slight misspellings if needed
        dbQuery['location.city'] = { $regex: filters.city, $options: 'i' };
    }

    if (filters.minPrice || filters.maxPrice) {
        dbQuery.price = {};
        if (filters.minPrice) dbQuery.price.$gte = filters.minPrice;
        if (filters.maxPrice) dbQuery.price.$lte = filters.maxPrice;
    }

    if (filters.minBedrooms) {
        dbQuery.bedrooms = { $gte: filters.minBedrooms };
    }

    if (filters.amenities && filters.amenities.length > 0) {
        // Simple regex match for each amenity
        dbQuery.amenities = { 
            $in: filters.amenities.map(a => new RegExp(a, 'i')) 
        };
    }

    console.log("Constructed DB Query:", JSON.stringify(dbQuery, null, 2));

    // Step 3: Execute Query
    const properties = await Property.find(dbQuery).limit(10).sort({ createdAt: -1 });

    res.status(200).json({ 
        filters, 
        count: properties.length, 
        properties 
    });

  } catch (error) {
    console.error('AI Recommendation Error:', error);
    res.status(500).json({ 
      message: 'Failed to get recommendations', 
      error: error.message 
    });
  }
};

// FEATURE 5: SEED TEST PROPERTIES (for development/testing)
const seedTestProperties = async (req, res) => {
  try {
    const testProperties = [
      {
        title: "Modern 3BHK Apartment in Rajkot",
        description: "Beautiful modern apartment with excellent amenities and city views. Perfect for families looking for comfortable living spaces.",
        propertyType: "apartment",
        price: 8500000,
        location: {
          address: "150 Feet Ring Road, Near Big Bazaar",
          city: "Rajkot",
          state: "Gujarat",
          zipCode: "360005",
          coordinates: { lat: 22.3039, lng: 70.8022 }
        },
        bedrooms: 3,
        bathrooms: 2,
        area: 1200,
        areaUnit: "sqft",
        images: ["/api/placeholder/400/300"],
        amenities: ["gym", "parking", "pool", "security", "lift", "power backup"],
        status: "available",
        featured: true
      },
      {
        title: "Luxury 2BHK Flat in Rajkot East",
        description: "Spacious 2BHK flat with modern amenities in a prime location. Close to schools, hospitals, and shopping centers.",
        propertyType: "flat",
        price: 6500000,
        location: {
          address: "Kasturba Road, Rajkot East",
          city: "Rajkot",
          state: "Gujarat",
          zipCode: "360001",
          coordinates: { lat: 22.3072, lng: 70.7967 }
        },
        bedrooms: 2,
        bathrooms: 2,
        area: 950,
        areaUnit: "sqft",
        images: ["/api/placeholder/400/300"],
        amenities: ["parking", "security", "garden", "modular kitchen"],
        status: "available",
        featured: false
      },
      {
        title: "Premium 4BHK Villa in Rajkot",
        description: "Luxurious villa with private garden and modern facilities. Perfect for those seeking privacy and space.",
        propertyType: "villa",
        price: 25000000,
        location: {
          address: "Kalavad Road, Near Airport",
          city: "Rajkot",
          state: "Gujarat",
          zipCode: "360005",
          coordinates: { lat: 22.3100, lng: 70.8100 }
        },
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        areaUnit: "sqft",
        images: ["/api/placeholder/400/300"],
        amenities: ["garden", "parking", "security", "pool", "servant quarter"],
        status: "available",
        featured: true
      },
      {
        title: "Affordable 1BHK Apartment",
        description: "Perfect for first-time buyers or investment. Well-maintained building with all basic amenities.",
        propertyType: "apartment",
        price: 3500000,
        location: {
          address: "University Road, Near Mota Bazaar",
          city: "Rajkot",
          state: "Gujarat",
          zipCode: "360005",
          coordinates: { lat: 22.2973, lng: 70.8022 }
        },
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        areaUnit: "sqft",
        images: ["/api/placeholder/400/300"],
        amenities: ["parking", "security", "water supply"],
        status: "available",
        featured: false
      },
      {
        title: "Commercial Space in Rajkot",
        description: "Prime commercial location for business. High footfall area, perfect for retail or office space.",
        propertyType: "commercial",
        price: 15000000,
        location: {
          address: "Dr. Yagnik Road, Central Rajkot",
          city: "Rajkot",
          state: "Gujarat",
          zipCode: "360001",
          coordinates: { lat: 22.3050, lng: 70.8000 }
        },
        bedrooms: 0,
        bathrooms: 2,
        area: 1800,
        areaUnit: "sqft",
        images: ["/api/placeholder/400/300"],
        amenities: ["parking", "security", "power backup", "ac"],
        status: "available",
        featured: false
      }
    ];

    // Check if properties already exist
    const existingCount = await Property.countDocuments();
    if (existingCount > 0) {
      return res.status(200).json({
        success: true,
        message: `Database already has ${existingCount} properties. No new properties added.`,
        existingCount
      });
    }

    // Create dummy users for the properties (since properties require owners)
    const User = require('../models/User');

    // Check if we have any users, if not create a dummy agent
    let agent = await User.findOne({ role: 'agent' });
    if (!agent) {
      agent = await User.create({
        name: 'Test Agent',
        email: 'agent@test.com',
        password: 'password123',
        phone: '9876543210',
        role: 'agent',
        isActive: true
      });
    }

    // Add owner/agent to all properties
    const propertiesWithUsers = testProperties.map(prop => ({
      ...prop,
      owner: agent._id,
      agent: agent._id
    }));

    const properties = await Property.insertMany(propertiesWithUsers);

    res.status(201).json({
      success: true,
      message: `Successfully added ${properties.length} test properties to the database`,
      count: properties.length,
      properties: properties.map(p => ({
        id: p._id,
        title: p.title,
        price: p.price,
        bedrooms: p.bedrooms,
        city: p.location.city,
        type: p.propertyType
      }))
    });

  } catch (error) {
    console.error('Seed Test Properties Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed test properties',
      error: error.message
    });
  }
};

module.exports = {
  chatWithAI,
  generatePropertyDescription,
  recommendProperties,
  seedTestProperties
};
