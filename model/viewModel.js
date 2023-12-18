const mongoose=require('mongoose')


const viewSchema=mongoose.Schema({
    viewBy: {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    productOwnerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true 
    }

},
{timestamps:true})

module.exports=mongoose.model("View",viewSchema)
