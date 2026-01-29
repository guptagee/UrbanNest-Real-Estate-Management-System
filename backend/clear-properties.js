const mongoose = require('mongoose');
const Property = require('./models/User');

mongoose.connect('mongodb://localhost:27017/rems').then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear all existing properties
    const result = await Property.deleteMany({});
    console.log(`Cleared ${result.deletedCount} existing properties`);
    
    // Close connection before running seed
    mongoose.connection.close();
    
    // Run seed script in a separate process
    console.log('Running seed-properties.js...');
    const { exec } = require('child_process');
    exec('node seed-properties.js', (error, stdout, stderr) => {
      if (error) {
        console.error('Error running seed:', error.message);
      } else {
        console.log(stdout);
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('Connection error:', err.message);
});
