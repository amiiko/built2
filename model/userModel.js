const mongoose=require('mongoose')
const imageSchema = new mongoose.Schema({
    
  });

const userSchema=mongoose.Schema({
    name: {
        type :String,
        required:[true,"Please Enter Your Name"]
    },
    email: {
        type :String,
        required:[true,"Please Enter Your Email"],
        unique:true
    },
    password: {
        type :String,
        // required:[true,"Please Enter Your Password"]
    },
    uniqueID:{
        type :String,
        // required:[true,"Please Enter Your Password"]
    },
    photo:{
        filename: {
        type: String,
        default:"person.png"
        //   required: true
      },
      size: {
        type: Number,
        default:122178
        //   required: true
      },},
    phoneNo:{
        type: String ,
        default:"251963520811"
    },
    telegramUserName:{
        type: String ,
        default: "N/A"
    },
    city:{
        type: String ,
        default: "N/A"
    },
    country:{
        type: String ,
        default: "N/A"
    },
    facebookUserName:{
        type: String ,
        default: "N/A"
    },
    instagramUserName:{
        type: String ,
        default: "N/A"
    },

},
{ timestamps: true });

module.exports=mongoose.model("user",userSchema)