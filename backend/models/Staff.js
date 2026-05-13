const mongoose=require('mongoose');

const StaffSchema=new mongoose.Schema({
    staffId:{
        type:String,
        required:true,
        unique:true,
        immutable:true
    },
    staffName:{
        type:String,
        required:true
    },
    workingRole:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'StaffRole',
        required:true
    },
    class: {
  type: String,
  required: false
},

    mobileNumber:{
        type:String,
        required:true
    },
    alternateMobileNumber:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    landmark:{
        type:String
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

module.exports=mongoose.model('Staff',StaffSchema);