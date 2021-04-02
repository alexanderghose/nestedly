const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: String,
  lastContacted: Date,
  phone: String,
  email: String,
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  // },
  nest: {type: Schema.Types.ObjectId, ref: 'Nest'},
  industry: String, // this is apparently useful for the dashboard, to be able to quickly see what kind of user they are
  notes: String,
  value: Number, // 1-5 stars
  colour: String,
  tags: [String], // should probably use referencing for this at some point
  depository: [String], // an array of filenames either on s3 or the server
  // optional future fields:
  //goesBy: String, // what the person "goes by", eg., "phil" for "philip n" so autogen emails can start "Dear Phil,"
  // dateOfBirth: Date,
  // otherEmails: [String],
  // otherPhoneNumbers: [String],
  // otherContactMethods: [{ <-- until ContactMethod gets its own schema, we store [{"wechat":"asdf"}, {"whatsapp":"4161231234"}, ...]
  //   method: String,   
  //   info: String
  // }], 
}, {
  timestamps: true
});

let ContactModel = mongoose.model('Contact', contactSchema);

module.exports = {
  ContactModel,
  contactSchema,
}