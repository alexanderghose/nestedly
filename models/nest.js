const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = require('./contact').contactSchema;

const nestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  frequency: {
    type: Number,
    required: true,
  }, // contact frequency for each member of this nest (in days)
  colour: String,
  tags: [String],
  contacts: [contactSchema]
}, {
  timestamps: true
});

let NestModel = mongoose.model('Nest', nestSchema);

module.exports = {
  NestModel,
  nestSchema,
}