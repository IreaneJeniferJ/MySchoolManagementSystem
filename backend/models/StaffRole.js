const mongoose=require('mongoose');

const staffRoleSchema=new mongoose.Schema({
    staffRole:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
},
{timestamps:true});

module.exports=mongoose.model('StaffRole',staffRoleSchema);