const express = require('express');
const router = express.Router();
const Errand = require('../models/Errand');

// GET all errands
router.get('/', async (req, res) => {
  try {
    const errands = await Errand.find().sort({ createdAt: -1 });
    res.json(errands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single errand
router.get('/:id', async (req, res) => {
  try {
    const errand = await Errand.findById(req.params.id);
    if (!errand) {
      return res.status(404).json({ message: 'Errand not found' });
    }
    res.json(errand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE errand
router.post('/', async (req, res) => {
  const errand = new Errand({
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    status: req.body.status,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    notes: req.body.notes,
    results: req.body.results,
  });

  try {
    const newErrand = await errand.save();
    res.status(201).json(newErrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE errand
router.put('/:id', async (req, res) => {
  try {
    const errand = await Errand.findById(req.params.id);
    if (!errand) {
      return res.status(404).json({ message: 'Errand not found' });
    }

    Object.assign(errand, req.body);
    const updatedErrand = await errand.save();
    res.json(updatedErrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE errand
router.delete('/:id', async (req, res) => {
  try {
    const errand = await Errand.findById(req.params.id);
    if (!errand) {
      return res.status(404).json({ message: 'Errand not found' });
    }

    await errand.deleteOne();
    res.json({ message: 'Errand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
