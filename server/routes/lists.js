const express = require('express');
const router = express.Router();
const List = require('../models/List');

// GET all lists
router.get('/', async (req, res) => {
  try {
    const lists = await List.find().sort({ createdAt: -1 });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single list
router.get('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE list
router.post('/', async (req, res) => {
  const list = new List({
    title: req.body.title,
    items: req.body.items,
    category: req.body.category,
  });

  try {
    const newList = await list.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE list
router.put('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    Object.assign(list, req.body);
    const updatedList = await list.save();
    res.json(updatedList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE list
router.delete('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    await list.deleteOne();
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
