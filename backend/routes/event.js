const express = require('express');
const router = express.Router();
const Event = require('../models/Event.js');

router.post('/addEvent', async (req, res) => {
  try {
    console.log("Incoming Event Data:", req.body); 
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Add Event Error:", err); 
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('label').sort({ startDate: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('label');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/updateEvent/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
