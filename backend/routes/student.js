const express = require('express');
const router = express.Router();
const student = require('../models/Student.js');
const Standard = require('../models/Standard.js'); 

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


router.get('/getAllStandards', async (req, res) => {
  try {
    console.log("Fetching standards...");
    console.log("getAllStandards route called");
    const standards = await Standard.find({ status: 'Active' }).sort({ standard: 1 });
    console.log("Found standards:", standards);
    res.status(200).json(standards);
  } catch (err) {
    console.error("Error in getAllStandards:", err); 
    res.status(500).json({ message: err.message });
  }
});

router.get('/ping', (req, res) => {
  res.status(200).json({ message: "pong" });
});


const mongoose = require('mongoose');

router.get('/generateId/:standard', async (req, res) => {
  try {
    const standardId = req.params.standard;
    const year = new Date().getFullYear();

    const count = await student.countDocuments({
      standard: new mongoose.Types.ObjectId(standardId),
      createdAt: {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
      }
    });

    const paddedCount = String(count + 1).padStart(3, '0');
    const generatedId = `RS${year}${paddedCount}`;

    res.status(200).json({ studentId: generatedId });
  } catch (err) {
    console.error('Error generating student ID:', err);
    res.status(500).json({ message: err.message });
  }
});


router.post('/addStudent', upload.single('profilePicture'), async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      standard,
      parentName,
      mobileNumber,
      alternateMobileNumber,
      address,
      landmark,
      city,
      state,
      country,
      gender
    } = req.body;

    const newStudent = await student.create({
      studentId,
      studentName,
      standard,
      parentName,
      mobileNumber,
      alternateMobileNumber,
      address,
      landmark,
      city,
      state,
      country,
      gender,
      profilePicture: req.file ? req.file.filename : null
    });

    res.status(201).json(newStudent);
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const query = search
      ? {
          $or: [
            { studentName: { $regex: new RegExp(search, 'i') } },
            { studentId: { $regex: new RegExp(search, 'i') } }
          ]
        }
      : {};

    const totalCount = await student.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const findStudent = await student
      .find(query)
      .populate('standard')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      data: findStudent,
      totalPages,
      totalCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.put('/updateStudent/:id', upload.single('profilePicture'), async (req, res) => {
  try {
    const updateData = {
      studentName: req.body.studentName,
      parentName: req.body.parentName,
      mobileNumber: req.body.mobileNumber,
      address: req.body.address,
    };

    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }

    const updateStudent = await student.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updateStudent) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    res.status(200).json(updateStudent);
  } catch (err) {
    res.status(500).json({ message: 'Update failed: ' + err.message });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const deleteStudent = await student.findByIdAndDelete(req.params.id);
    if (!deleteStudent) {
      return res.status(404).json({ message: 'record not found' });
    }
    res.status(200).json({ message: 'record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'deletion failed: ' + err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    console.log("get by ID route called with id =", req.params.id);
    const oneStudent = await student.findOne({ studentId: req.params.id }).populate('standard');
    if (!oneStudent) {
      return res.status(404).json({ message: 'student record not found' });
    }
    res.status(200).json(oneStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/byId/:id', async (req, res) => {
  try {
    const oneStudent = await student.findById(req.params.id).populate('standard');
    if (!oneStudent) {
      return res.status(404).json({ message: 'Student record not found' });
    }
    res.status(200).json(oneStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
