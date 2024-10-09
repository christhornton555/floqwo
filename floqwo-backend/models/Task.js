const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending' },  // default status is 'pending'
  createdAt: { type: Date, default: Date.now },  // auto-set creation date
});

module.exports = mongoose.model('Task', taskSchema);
