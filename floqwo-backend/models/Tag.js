const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  color: {
    type: String,
    default: '#000000'  // Default color, can be customized
  }
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
