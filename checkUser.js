const crypto = require('crypto');
const User = require('../models/User').User;

module.exports = async function checkUser(username, password) {
  const user = await User.findOne({ username });
  if (!user) return null;
  const hash = crypto.scryptSync(password, user.salt, 64).toString('hex');
  const stored = Buffer.from(user.hashedPassword, 'hex');
  const supplied = Buffer.from(hash, 'hex');
  if (stored.length !== supplied.length || !crypto.timingSafeEqual(stored, supplied)) return null;
  return user;
};
