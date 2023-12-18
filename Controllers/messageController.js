const messageModel = require('../model/messageModel')
const asyncHandler = require('express-async-handler')
var mongoose = require('mongoose');

const moment = require('moment')

function formatMessage(senderId, receiverId, message, currentRoom) {
  return {
    senderId,
    receiverId,
    message,
    time: moment().format('YYYY-MM-DD h:mm a'),
    currentRoom

  }
}



function createRoomName(id1, id2) {
  // make sure id1 is the smaller value for
  // consistency of generation
  // if (id1 > id2) {
  //     // swap two values
  //     let temp = id2;
  //     id2 = id1;
  //     id1 = temp;
  // }
  // // console.log(id1.toString(10).padStart(10, "0") + id2.toString(10).padStart(10, "0"))
  // return id1.toString(10).padStart(10, "0") + id2.toString(10).padStart(10, "0");
}

const getMessages = asyncHandler(async (req, res) => {
  try {
    const query1 = {
      $or: [
        {
          "userOneId": new mongoose.Types.ObjectId(req.user.id)
        },
        {
          "userTwoId": new mongoose.Types.ObjectId(req.user.id)
        }
      ]
    };
    const messages = await messageModel.find(query1).sort({ updatedAt: -1 });;
    // console.log(messages)
    // console.log(req.user.id)
    if (messages) {
      res.status(200).json(messages);
    } else {
      res.status(404).json({ message: "invalid data" });
    }
  } catch (err) {
    res.status(404).json({ message: "", error: err });
  }
});

const getRoomMessage = asyncHandler(async (req, res) => {

  // console.log(req.query.room)

  const query1 = { roomId: req.query.room };
  const messages = await messageModel.findOne(query1);
  // console.log(messages)



  if (messages) {
    res.status(200).json(messages);
  } else {
    res.status(404);
  }

});

//get user 
//method get 
//path /user/
//access public
const getUserSearch = asyncHandler(async (req, res) => {
  // console.log('hello')
  console.log()
  const query = {
    $or: [
      {
        "userOneName": req.query.userName
      },
      {
        "userTwoName": req.query.userName
      }
    ]
  };
  // const query = { email: { $regex: req.query.userName } };
  const users = await messageModel.find(query)

  console.log(users)
  if(users){
      
      res.status(200).json({users})
  }
  else{
      
      res.status(404).json({
          message:"Error please try again later."
      })
  }
  
}
)

module.exports = { formatMessage, createRoomName, getMessages,getUserSearch, getRoomMessage }