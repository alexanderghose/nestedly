const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: String,
  lastContacted: Date,
  phone: String,
  email: String,
  nest: {type: Schema.Types.ObjectId, ref: 'Nest'},
  notes: String,
  //goesBy: String, // what the person "goes by", eg., "phil" for "philip n" so autogen emails can start "Dear Phil,"
  // dateOfBirth: Date,
  // emails: [String],
  // phoneNumbers: [String],
  // otherMethods: [{
  //   method: String,
  //   contactDetails: String
  // }], // until ContactMethod gets its own schema, we store "[wechat:asdf, whatsapp:"4161231234"]"
}, {
  timestamps: true
});

let ContactModel = mongoose.model('Contact', contactSchema);

module.exports = {
  ContactModel,
  contactSchema,
}