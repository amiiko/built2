const product = require('../model/productModel');
const asyncHandler = require('express-async-handler');

const getFavorite = asyncHandler(async (req, res) => {
    const myId = req.user.id
    const favorite = await product.find({ "favorite.favoriteBy": myId });
    res.status(200).json({ favorite })
});
const postFavorite = asyncHandler(async (req, res) => {

    const { productId } = req.body;
    const myId = req.user.id


    const favorite = await product.findById(productId);
    let exists = false

    for (const i of favorite.favorite) {
        if (i.favoriteBy.equals(myId)) {
            exists = true
        }
    }
    if (exists === true) {
        favorite.favorite.remove({ favoriteBy: myId });
        favorite.save();
        res.status(201).json({ "Response": "removed" })
    } else {
        favorite.favorite.push({ favoriteBy: myId });
        favorite.save();
        res.status(201).json({ "Response": "Added" })
    }



});



module.exports = {
    getFavorite,
    postFavorite,
};