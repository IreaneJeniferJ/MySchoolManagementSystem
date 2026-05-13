const mongoose=require('mongoose');

const StudentSchema=new mongoose.Schema({
    studentId:{
        type:String,
        required:true,
        unique:true,
        immutable:true
    },
    studentName:{
        type:String,
        required:true
    },
    
    standard:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Standard',
        required:true
    },
    parentName:{
        type:String,
        required:true,
    },
    mobileNumber:{
        type:String,
        required:true
    },
    alternateMobileNumber:{
        type:String
    },
    gender:{
        type:String,
        enum:['Male','Female','Other'],
        default:'Male',
        required:true
    },
    profilePicture: {
    type: String
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
    },
    country:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});

module.exports=mongoose.model('Student',StudentSchema);