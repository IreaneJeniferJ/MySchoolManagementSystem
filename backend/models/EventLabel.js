const mongoose=require('mongoose');

const eventLabelSchema=new mongoose.Schema(
    {
        event:{
            type:String,
            required:true
        },
        color:{
            type:String,
            enum:['red','green','blue','yellow','orange','pink','purple','violet'],
            required:true
        },
        status:{
            type:String,
            enum:['Active','Inactive'],
            default:'Active'
        }
    },
    {timestamps:true}
);

module.exports=mongoose.model('EventLabel',eventLabelSchema);