const mongoose = require('mongoose');
const Property = require('./models/Property');
require('dotenv').config();

const sampleProperties = [
  {
    title: "Modern 3BHK Apartment in Rajkot",
    description: "Beautiful modern apartment with excellent amenities and city views",
    propertyType: "apartment",
    price: 8500000, // 85 lakhs
    location: {
      address: "150 Feet Ring Road",
      city: "Rajkot",
      state: "Gujarat",
      zipCode: "360005",
      coordinates: { lat: 22.3039, lng: 70.8022 }
    },
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    areaUnit: "sqft",
    images: ["/property1.jpg"],
    amenities: ["gym", "parking", "pool", "security", "lift"],
    status: "available",
    featured: true
  },
  {
    title: "Luxury 2BHK Flat in Rajkot East",
    description: "Spacious 2BHK flat with modern amenities",
    propertyType: "flat",
    price: 6500000, // 65 lakhs
    location: {
      address: "Kasturba Road",
      city: "Rajkot",
      state: "Gujarat",
      zipCode: "360001",
      coordinates: { lat: 22.3072, lng: 70.7967 }
    },
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    areaUnit: "sqft",
    images: ["/property2.jpg"],
    amenities: ["parking", "security", "garden"],
    status: "available",
    featured: false
  },
  {
    title: "Premium 4BHK Villa in Rajkot",
    description: "Luxurious villa with private garden and modern facilities",
    propertyType: "villa",
    price: 25000000, // 2.5 crores
    location: {
      address: "Kalavad Road",
      city: "Rajkot",
      state: "Gujarat",
      zipCode: "360005",
      coordinates: { lat: 22.3100, lng: 70.8100 }
    },
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    areaUnit: "sqft",
    images: ["/property3.jpg"],
    amenities: ["garden", "parking", "security", "pool"],
    status: "available",
    featured: true
  },
  {
    title: "Affordable 1BHK Apartment",
    description: "Perfect for first-time buyers or investment",
    propertyType: "apartment",
    price: 3500000, // 35 lakhs
    location: {
      address: "University Road",
      city: "Rajkot",
      state: "Gujarat",
      zipCode: "360005",
      coordinates: { lat: 22.2973, lng: 70.8022 }
    },
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    areaUnit: "sqft",
    images: ["/property4.jpg"],
    amenities: ["parking", "security"],
    status: "available",
    featured: false
  },
  {
    title: "Commercial Space in Rajkot",
    description: "Prime commercial location for business",
    propertyType: "commercial",
    price: 15000000, // 1.5 crores
    location: {
      address: "Dr. Yagnik Road",
      city: "Rajkot",
      state: "Gujarat",
      zipCode: "360001",
      coordinates: { lat: 22.3050, lng: 70.8000 }
    },
    bedrooms: 0,
    bathrooms: 2,
    area: 1800,
    areaUnit: "sqft",
    images: ["/property5.jpg"],
    amenities: ["parking", "security"],
    status: "available",
    featured: false
  }
];

async function seedProperties() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rems');

    console.log('Connected to MongoDB');

    // Clear existing properties
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Add sample properties
    const properties = await Property.insertMany(sampleProperties);
    console.log(`Added ${properties.length} sample properties`);

    console.log('Sample properties added successfully!');
    console.log('You can now test the AI chatbot with queries like:');
    console.log('- "Find 3BHK apartments in Rajkot"');
    console.log('- "Show me properties under 1 crore"');
    console.log('- "Find villas with pool in Rajkot"');

  } catch (error) {
    console.error('Error seeding properties:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedProperties();
