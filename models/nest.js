const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nestSchema = new Schema({
  name: String,
  frequency: Number, // contact frequency for each member of this nest (in days)
  colour: String,
  tags: [String],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Nest', nestSchema);