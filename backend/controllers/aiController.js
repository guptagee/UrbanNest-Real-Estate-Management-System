const OpenAI = require('openai');
const Property = require('../models/Property');

// Initialize OpenAI client pointing to OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEMINI_API_KEY, // User stored OpenRouter key here
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173", // Site URL for OpenRouter rankings
    "X-Title": "REMS", // Site title
  }
});

const MODELS = [
  "google/gemini-2.0-flash-001",
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "google/gemini-pro-1.5",
  "google/gemini-pro"
];

// Helper to try models
const generateWithOpenRouter = async (messages, jsonMode = false) => {
  let lastError = null;

  for (const model of MODELS) {
    try {
      const completion = await openai.chat.completions.create({
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
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ message: 'API key not configured' });
    }

    const messages = [
      { 
        role: "system", 
        content: "You are a real estate assistant for REMS. Answer only real-estate related queries. If data is unavailable, respond with a safe fallback." 
      },
      { role: "user", content: message }
    ];

    const botReply = await generateWithOpenRouter(messages);
    res.status(200).json({ reply: botReply });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      message: 'Failed to get AI response',
      error: error.message 
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

    if (!process.env.GEMINI_API_KEY) {
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

    const description = await generateWithOpenRouter(messages);
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

    if (!process.env.GEMINI_API_KEY) {
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
    let jsonStr = await generateWithOpenRouter(messages, true);
    
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

module.exports = {
  chatWithAI,
  generatePropertyDescription,
  recommendProperties
};
