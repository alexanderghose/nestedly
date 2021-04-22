const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = require('./contact').contactSchema;

const nestSchema = new Schema({
  name: String,
  frequency: Number, // contact frequency for each member of this nest (in days)
  colour: String,
  tags: [String],
  user: [contactSchema]
}, {
  timestamps: true
});

let NestModel = mongoose.model('Nest', nestSchema);

module.exports = {
  NestModel,
  nestSchema,
}