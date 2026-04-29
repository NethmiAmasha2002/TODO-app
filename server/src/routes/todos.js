const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

router.get('/', async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({ success: true, data: todos, count: todos.length });
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, tags } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, error: 'Title is required' });
    const todo = await Todo.create({ title: title.trim(), description: description?.trim() || '', priority: priority || 'medium', dueDate: dueDate || null, tags: tags || [] });
    res.status(201).json({ success: true, data: todo });
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ success: false, error: Object.values(e.errors).map(x => x.message).join(', ') });
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, tags } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, error: 'Title is required' });
    const todo = await Todo.findByIdAndUpdate(req.params.id, { title: title.trim(), description: description?.trim() || '', priority, dueDate: dueDate || null, tags: tags || [] }, { new: true, runValidators: true });
    if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
    res.json({ success: true, data: todo });
  } catch (e) {
    if (e.name === 'CastError') return res.status(400).json({ success: false, error: 'Invalid ID' });
    next(e);
  }
});

router.patch('/:id/done', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
    todo.done = !todo.done;
    await todo.save();
    res.json({ success: true, data: todo });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
    res.json({ success: true, message: 'Deleted', data: todo });
  } catch (e) { next(e); }
});

module.exports = router;
