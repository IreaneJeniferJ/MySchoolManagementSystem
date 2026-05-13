const express=require('express');
const router=express.Router();
const staff=require('../models/Staff');

router.get("/staffCount", async (req, res) => {
  try {
    const count = await staff.countDocuments(); 
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to get staff count" });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const query = search
      ? {
          $or: [
            { staffName: { $regex: new RegExp(search, 'i') } },
            
          ],
        }
      : {};

    const totalCount = await staff.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const findStaff = await staff
      .find(query)
      .populate({ path: 'workingRole', select: 'staffRole' })
      .populate({ path: 'class', select: 'standard' }) 
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      data: findStaff,
      totalPages,
      totalCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post('/addStaff', async (req, res) => {
  console.log("Incoming staff payload:", req.body); 

  try {
    const newStaff = await staff.create(req.body);
    res.status(201).json(newStaff);
  } catch (err) {
    console.error("Error creating staff:", err); 
    res.status(500).json({ message: err.message });
  }
});


router.put('/update/:id',async(req,res)=>{
    try{
        const updateStaff=await staff.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!updateStaff){
            res.status(404).json({message:'staff not found'});
        }
        res.status(200).json(updateStaff);
    }
    catch(err){
        res.status(500).json({message:'error'+err.message});
    }
});

router.delete('/delete/:id',async(req,res)=>{
    try{
        const deleteStaff = await staff.findOneAndDelete({ _id: req.params.id });
        if(!deleteStaff){
            res.status(404).json({message:'staff not found'});
        }
        res.status(200).json(deleteStaff);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

module.exports=router;