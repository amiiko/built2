const product = require('../model/notificationModel');
const asyncHandler = require('express-async-handler');





const getNotification = asyncHandler(async (req, res) => {
    const receiverId = req.user.id
    const notification = await product.find({ receiverId: receiverId });;
    res.status(200).json({ notification })
});

const postNotification = asyncHandler(async (senderId,receiverId,message,messageType) => {

    // console.log(req.user.id)
    // const { message,productOwnerId } = data
    // const myId = req.user.id
    const notification = await product.create({
        message,
        receiverId,
        senderId,
        messageType
        
      });

      if(notification){
        console.log("true")
      }
    

      



});

module.exports = {
    getNotification,
    postNotification
    //   deleteFavorite
};