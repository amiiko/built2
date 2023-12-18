const mongoose=require('mongoose')


const notificationSchema=mongoose.Schema({
    message: {
        type:String,
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true 
    },
    messageType:{
        type:String,
    }

},
{timestamps:true})
module.exports=mongoose.model("Notification",notificationSchema)
