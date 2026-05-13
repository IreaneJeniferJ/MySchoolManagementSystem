const express = require('express');
const router = express.Router();
const StaffRole = require('../models/staffRole.js');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const query = {
      ...(search ? { staffRole: { $regex: new RegExp(search, "i") } } : {}),
    };

    const totalCount = await StaffRole.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const roles = await StaffRole.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ data: roles, totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const oneRole = await StaffRole.findById(req.params.id);
    if (!oneRole) {
      return res.status(404).json({ message: 'Staff Role not found' });
    }
    res.status(200).json(oneRole);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/addRole', async (req, res) => {
  try {
    const newRole = await StaffRole.create(req.body);
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/updateRole/:id', async (req, res) => {
  try {
    const updatedRole = await StaffRole.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRole) {
      return res.status(404).json({ message: 'Staff Role not found' });
    }
    res.status(200).json({ message: 'Staff Role updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedRole = await StaffRole.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      return res.status(404).json({ message: 'Staff Role not found' });
    }
    res.status(200).json({ message: 'Staff Role Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
