const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  githubUrl: {
    type: String,
    default: '',
  },
  liveUrl: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
