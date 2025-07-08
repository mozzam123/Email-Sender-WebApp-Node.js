const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  sentEmails: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Email'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 