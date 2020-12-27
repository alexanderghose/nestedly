const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nestSchema = new Schema({
  name: String,
  contactFrequencyInDays: Number,
}, {
  timestamps: true
});

module.exports = mongoose.model('Nest', nestSchema);