const mongoose=require('mongoose')


const favoriteSchema=mongoose.Schema({
    favoriteBy: {
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
module.exports=mongoose.model("Favorite",favoriteSchema)
 