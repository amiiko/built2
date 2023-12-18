const product = require('../model/productModel');
const asyncHandler = require('express-async-handler');
const messageModel = require('../model/messageModel')
const user = require('../model/userModel')
const mongoose = require('mongoose');

const postView = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  // console.log(productId)

  const clientIp = req.ip;
  const Product = await product.findById(productId);

  if (Product) {
    Product.view.push({ ipAddress: clientIp });
    await Product.save();
    res.status(201).end();
  }
  res.status(404).end(); // Respond with a 500 status and no specific content

});

const getView = asyncHandler(async (req, res) => {
  const id = req.user.id;
  // console.log(id)


  const Product1 = await product.find({ postedBy: new mongoose.Types.ObjectId(id) });

  // console.log(Product1.view);
  const dateObjects = Product1.map(dateStamp => dateStamp.view.map(d => new Date(d.createdAt)));
  // console.log(dateObjects)
  const allDateStamps = dateObjects.flat();



  const Product2 = await product.find({ postedBy: new mongoose.Types.ObjectId(id) });
  // console.log(Product1.view);
  const dateObjects2 = Product2.map(dateStamp => dateStamp.favorite.map(d => new Date(d.createdAt)));
  // console.log(dateObjects)
  const favoriteStat = dateObjects2.flat();




  const query1 = {
    $or: [
      {
        "userOneId": new mongoose.Types.ObjectId(id)
      },
      {
        "userTwoId": new mongoose.Types.ObjectId(id)
      }
    ]
  };
  const messagesStat = await messageModel.find(query1);

  const dateObjects3 = messagesStat.map(dateStamp => dateStamp.message.map(d=>new Date(d.createdAt)));
  // console.log(dateObjects)
  const messageStat = dateObjects3.flat();

  // console.log(messageStat)





  const ProductStat = await product.find({ postedBy: new mongoose.Types.ObjectId(id) });
  // console.log(Product1.view);
  const dateObjects4 =  ProductStat.map(dateStamp => new Date(dateStamp.createdAt));
  // console.log(dateObjects)
  const product4 = dateObjects4.flat();

  console.log(product4)

  const Product = await product.find({ postedBy: new mongoose.Types.ObjectId(id) });
  const createDateUser = await user.findById(new mongoose.Types.ObjectId(id) );
  const dateUser=createDateUser.createdAt
  // console.log(Product)
  if (Product) {

    let count = 0;
    Product.forEach(item => {
      count += item.view.length;
    });
    // console.log(count)
    res.status(201).json({ count, allDateStamps, favoriteStat,messageStat,product4,dateUser });

  }
  res.status(404).end(); // Respond with a 500 status and no specific content

});


module.exports = {
  postView,
  getView
};

