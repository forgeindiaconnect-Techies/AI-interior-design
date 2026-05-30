const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'vendor', 'admin', 'manufacturer', 'delivery', 'installation'], 
    default: 'user' 
  },
  phone: { type: String },
  address: { type: String },
  status: { 
    type: String, 
    enum: ['Active', 'Suspended', 'Blocked'], 
    default: 'Active' 
  },
  suspensionReason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Password hash middleware
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
