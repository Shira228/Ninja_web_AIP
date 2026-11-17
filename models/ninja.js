const mongoose = require('mongoose');

const ninjaSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  nick: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  category: { type: String, required: true, enum: ['История', 'Персонажи', 'Техники'] },
  avatar: { type: String, default: '/images/ninja-mark.svg' },
  short: { type: String, required: true },
  desc: { type: String, required: true },
  skills: [{ type: String }],
  rank: { type: String, default: 'Путь ученика' },
  created: { type: Date, default: Date.now }
});

module.exports.Ninja = mongoose.models.Ninja || mongoose.model('Ninja', ninjaSchema);
