const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    time:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const messageSchema = mongoose.Schema({

    message: [chatSchema],
    roomId: {
        type: String,
        required: true
    },
    userOneId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userOneName: {
        type: String,
        required: true
    },
    userOneImage: {
        type: String,
        required: true
    },

    userTwoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userTwoName: {
        type: String,
        required: true
    },
    userTwoImage: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("Message", messageSchema)