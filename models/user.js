var mongoose = require('mongoose');
let contactsSchema = require('./contact').contactSchema
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 6;

let userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, required: true, lowercase: true, unique: true},
    password: String,
    contacts: [contactsSchema],
    dashboardOptions: [String], // todo: reference option 4eef2= sort by industry
    emailTemplates: [String],
    reminders: []
    // relics from OAuth:
    //avatar: String,
    //googleId: String
  }, {
    timestamps: true
});

// never send password
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    // remove the password property when serializing doc to JSON
    delete ret.password;
    return ret;
  }
});

// auto hash password before saving
userSchema.pre('save', function(next) {
  // 'this' will be set to the current document
  const user = this;
  if (!user.isModified('password')) return next();
  // password has been changed - salt and hash it
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
    if (err) return next(err);
    // replace the user provided password with the hash
    user.password = hash;
    next();
  });
});

// util for taking an incoming password, hashing it,
// and comparing it against the hashed password in db
userSchema.methods.comparePassword = function(tryPassword, cb) {
  // 'this' represents the document that you called comparePassword on
  bcrypt.compare(tryPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
