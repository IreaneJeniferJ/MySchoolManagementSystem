const express = require('express');
const router = express.Router();
const Standard=require('../models/Standard.js');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const query = search
      ? { $or: [
          { standard: { $regex: new RegExp(search, "i") } },
          { status: { $regex: new RegExp(search, "i") } }
        ]}
      : {};

    const totalCount = await Standard.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const standards = await Standard.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ data: standards, totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const oneStandard = await Standard.findById(req.params.id);
    if (!oneStandard) {
      return res.status(404).json({ message: 'Standard not found' });
    }
    res.status(200).json(oneStandard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/addStandards',async(req,res)=>{
  try{
    const addStandard = await Standard.create(req.body);
    res.status(201).json(addStandard);
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
})

router.put('/update/:id',async(req,res)=>{
  try{
    const updateStandard=await Standard.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!updateStandard){
      return res.status(404).json({message:'Standard record not found'});
    }
    res.status(200).json({message:'Standard updated'});
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
});

router.delete('/delete/:id',async(req,res)=>{
  try{
    const deleteStandard=await Standard.findByIdAndDelete(req.params.id);
    if(!deleteStandard){
      return res.status(404).json({message:'Standard not found'});
    }
    res.status(200).json({message:'Standard Deleted'});
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
});

module.exports = router;
