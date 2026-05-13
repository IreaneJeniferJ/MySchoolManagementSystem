const mongoose=require('mongoose');

const standardSchema = new mongoose.Schema({
  standard: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active' 
  }
}, { timestamps: true });


module.exports=mongoose.model('Standard',standardSchema);