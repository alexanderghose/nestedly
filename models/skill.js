/** this is just a test file. ignore this. */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
  skills: [{
      skill: String,
      level: String,
  }]
}, {
  timestamps: true
});

let SkillModel = mongoose.model('Skill', skillSchema);
module.exports = SkillModel