const mongoose=require('mongoose');

const EventSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    label:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'EventLabel',
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    description:{
        type:String,
    }
},
{
    timestamps:true
});

module.exports=mongoose.model('Event',EventSchema);