const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/rems').then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Create default agent user
    const agentExists = await User.findOne({ email: 'agent@urbannest.com' });
    
    if (!agentExists) {
      const agent = await User.create({
        name: 'Default Agent',
        email: 'agent@urbannest.com',
        password: 'password123',
        role: 'agent',
        phone: '+91 9876543210'
      });
      
      console.log('Default agent user created:');
      console.log('Email: agent@urbannest.com');
      console.log('Password: password123');
      console.log('Role: agent');
      console.log('User ID:', agent._id);
    } else {
      console.log('Agent user already exists');
    }
    
    // List all users
    const users = await User.find({}, 'email name role');
    console.log('\nAll users:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name}): role = ${user.role}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  mongoose.connection.close();
}).catch(err => {
  console.error('Connection error:', err.message);
});
