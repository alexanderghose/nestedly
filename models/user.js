var mongoose = require('mongoose');
let contactsSchema = require('./contact').contactSchema

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatar: String,
    contacts: [contactsSchema],
    googleId: String
  }, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
