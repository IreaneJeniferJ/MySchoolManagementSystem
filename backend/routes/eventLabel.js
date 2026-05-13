const express = require('express');
const router = express.Router();
const EventLabel = require('../models/EventLabel.js');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = {
      event: { $regex: new RegExp(search, 'i') },
    };

    const totalCount = await EventLabel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const labels = await EventLabel.find(query)
      .sort({ event: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: labels,
      totalPages,
      totalCount,
    });
  } catch (err) {
    console.error('Error fetching event labels:', err);
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const oneLabel = await EventLabel.findById(req.params.id);
    if (!oneLabel) {
      return res.status(404).json({ message: 'Event Label not found' });
    }
    res.status(200).json(oneLabel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/addEventLabel', async (req, res) => {
  console.log('Received data:', req.body);  
  try {
    const newLabel = await EventLabel.create(req.body);
    res.status(201).json(newLabel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.put('/updateEventLabel/:id', async (req, res) => {
  try {
    const updatedLabel = await EventLabel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLabel) {
      return res.status(404).json({ message: 'Event Label not found' });
    }
    res.status(200).json({ message: 'Event Label updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedLabel = await EventLabel.findByIdAndDelete(req.params.id);
    if (!deletedLabel) {
      return res.status(404).json({ message: 'Event Label not found' });
    }
    res.status(200).json({ message: 'Event Label deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
