const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true, minlength: 3, maxlength: 24 },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  created: { type: Date, default: Date.now }
});
module.exports.User = mongoose.models.User || mongoose.model('User', userSchema);
