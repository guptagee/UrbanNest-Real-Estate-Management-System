#!/bin/bash

# UrbanNest Frontend Deployment Script for Netlify

echo "🚀 Starting UrbanNest Frontend Deployment..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output is in the 'dist' directory"
echo ""
echo "🌐 Next steps for Netlify deployment:"
echo "1. Install Netlify CLI: npm install -g netlify-cli"
echo "2. Login to Netlify: netlify login"
echo "3. Deploy: netlify deploy --prod --dir=dist"
echo "4. Set up custom domain: urbannest.mukeshgupta.co.in"
echo ""
echo "🔧 Environment variables to set in Netlify:"
echo "- VITE_API_URL: https://urbannest-backend.mukeshgupta.co.in"
