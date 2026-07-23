const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  preferredCurrency: { type: String, default: 'INR' },
  timeZone: { type: String, default: 'UTC' },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_tracker';
    await mongoose.connect(uri);
    console.log('Connected to DB');

    const hashedPassword = await bcrypt.hash('password', 10);

    const userEmail = 'user@gmail.com';
    const adminEmail = 'admin@gmail.com';

    await User.deleteOne({ email: userEmail });
    await User.deleteOne({ email: adminEmail });

    await User.create({
      fullName: 'Demo User',
      email: userEmail,
      password: hashedPassword,
      mobileNumber: '1234567890',
      isVerified: true,
      role: 'user'
    });

    await User.create({
      fullName: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      mobileNumber: '0987654321',
      isVerified: true,
      role: 'admin'
    });

    console.log('Seeded User and Admin successfully');
  } catch (error) {
    console.error('Error seeding DB:', error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
