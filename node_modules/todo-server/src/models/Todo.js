const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String, required: [true, 'Title is required'],
    trim: true, minlength: 1, maxlength: 200,
  },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  done: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date, default: null },
  tags: [{ type: String, trim: true, maxlength: 30 }],
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);
