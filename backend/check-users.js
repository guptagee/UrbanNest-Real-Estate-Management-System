const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/rems').then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Check if agent user exists and has correct role
    const agent = await User.findOne({ email: 'agent@urbannest.com' });
    if (agent) {
      console.log('Agent found:', {
        id: agent._id,
        email: agent.email,
        name: agent.name,
        role: agent.role
      });
    } else {
      console.log('Agent user not found');
    }
    
    // List all users with their roles
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
