const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb://admin:Admin1234@ac-iy8tawe-shard-00-00.zlsjxln.mongodb.net:27017,ac-iy8tawe-shard-00-01.zlsjxln.mongodb.net:27017,ac-iy8tawe-shard-00-02.zlsjxln.mongodb.net:27017/todo-app?ssl=true&authSource=admin&retryWrites=true&w=majority';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;