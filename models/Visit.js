const mongoose = require('mongoose');
const visitSchema = new mongoose.Schema({
  path: { type: String, required: true },
  count: { type: Number, default: 0 }
});
module.exports.Visit = mongoose.models.Visit || mongoose.model('Visit', visitSchema);
