const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db_connection')
const { errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');

const { formatMessage } = require('./Controllers/messageController')
const { postNotification } = require('./Controllers/notificationController')
const messageModel = require('./model/messageModel')
const user = require('./model/userModel')
const path=require('path')

const moment = require('moment')

var mongoose = require('mongoose');


const port = 5000
const app = express()
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});


connectDB()

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());

// app.use(express.static("profilePhoto"))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', require('./routes/userRoutes'))
app.use('/admin', require('./routes/adminRoutes'))
app.use('/api', require('./routes/logoutRoutes'))



io.on('connect', socket => {
  // console.log('new connection');



  socket.on('join', roomId => {
    // console.log(roomId)
    // console.log(socket.rooms)
    socket.join(roomId);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'a user has left the chat.');
  });

  socket.on('chatMessage', async ({ newMessage, senderId, receiverId, currentRoom }) => {
    // console.log(receiverId,senderId,newMessage,currentRoom)

    // const newMessage2 = {
    //   senderId: '6482d1952c4a5d31dccdede8',
    //   receiverId: '64ae9c1608a7ca9b6e20d158',
    //   message: 'hello again',
    // };


    //     message.message.push(newMessage);

    // // Save the message document
    // messageModel.updateOne({ roomId: '6482d1952c4a5d31dccdede864ae9c1608a7ca9b6e20d158' }, { $set: { message: message.message } });


    let room = await messageModel.findOne({ roomId: currentRoom });
    let messageType="New Message"
    // console.log(room);
    // console.log(currentRoom)
    if (room) {
      // Room exists, push message to it
      room.message.push({
        senderId: senderId,
        receiverId: receiverId,
        message: newMessage,
        time:moment().format('YYYY-MM-DD h:mm a'),
      });

      await room.save();

      if (!room.isNew) {
        
        io.to(currentRoom).emit('message', formatMessage(senderId, receiverId, newMessage, currentRoom));
        postNotification(senderId,receiverId,newMessage,messageType)
      } else {
        console.log('There was an error while saving the room.');
      }
    }


    else {

      const userInfo = await user.findById(senderId)
      const name1 =userInfo.name
      const photo1="person.png"
      // const photo=userInfo.photo
      
      const userInfo2 = await user.findById(receiverId)
      const name2 =userInfo2.name
      const photo2="person.png"
      // const photo2=userInfo2.photo
      
      const message = await messageModel.create({
        message: {
          senderId: senderId,
          receiverId: receiverId,
          message: newMessage,
          time:moment().format('d:h:mm a'),
        },
        roomId: currentRoom,
        userOneId:senderId,         
        userOneImage:photo1,       
        userOneName:name1,

        userTwoId:receiverId,         
        userTwoImage:photo2,       
        userTwoName:name2

        


      })
      if (message) {
        postNotification(senderId,receiverId,newMessage,messageType)
        io.to(currentRoom).emit('message', formatMessage(senderId, receiverId, newMessage, currentRoom));
      }
    }

  });
});


app.use(errorHandler)


server.listen(port, () => console.log(`running on ${port}`))