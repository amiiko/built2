const product = require('../model/productModel')
const asyncHandler = require('express-async-handler')
var mongoose = require('mongoose');

 
//get homes 
//method get 
//path / 
//access public
const getHomes = asyncHandler(async (req, res) => {
    try {
      const homes = await product.findById(req.query.id);
      if (homes) {
        res.status(200).json(homes);
      } else {
        res.status(404).json({ message: "invalid data" });
      }
    } catch (err) {
      res.status(404).json({ message: "", error: err });
    }
  });

const getAllHomes = asyncHandler(async (req, res) => {
    const homes = await product.find({status:"published"})
    if (homes) {
        res.status(201).json(homes)
    }
    else {
        res.status(404).json({ message: "invalid data" })
    }
}
)


const getUserHomes = asyncHandler(async (req, res) => {

    const query = { "postedBy": new mongoose.Types.ObjectId(req.user.id)  };

    const homes = await product.find(query)
    if (homes) {
        res.status(201).json(homes)
    }
    else {
        res.status(404).json({ message: "invalid data" })
    }
}
)

const postHomes = asyncHandler(async (req, res) => {
    let { title, description, price, homeType, showProFor, bathroomCounter, bedroomCounter, utility, phoneNumber, instagram, facebook, whatsapp,location } = req.body
    console.log(location.lat)
    console.log(location)
    try {
        if (typeof utility === 'string') {
            utility = JSON.parse(utility);
        }
        if (typeof homeType === 'string') {
            homeType = JSON.parse(homeType);
        }
        if (typeof location === 'string') {
            location = JSON.parse(location);
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid JSON data" });
        return;
    }
    const files = req.files;
    const selectedImages = [];
    if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
            const { filename, size } = files[i];
            selectedImages.push({
                filename,
                size
            });
        }
    }
    else {
        res.status(400)
        throw new Error("Please provide all images")
    }
    if (!title || !price || !showProFor || !homeType || !req.user.id) {
        res.status(400)
        throw new Error("Please provide all details")
    }
    const homes = await product.create({
        title,
        description,
        price,
        location,
        selectedImages,
        postedBy: req.user.id,
        homeType,
        propertyFor: showProFor,
        bedRoom: bedroomCounter,
        bathRoom: bathroomCounter,
        utility,
        phoneNumber,
        instagram,
        facebook,
        whatsapp,
        status:"pending"
    })

    console.log(homes)

    if (homes) {
        res.status(201).json({ message: "success" })
    }
    else {
        res.status(404).json({ message: "invalid data" })
    }
})

const updateHome = asyncHandler(async (req, res) => {

    const productId = req.body.productId;
    const profileImgDelete = req.body.profileImgDelete ? req.body.profileImgDelete : ''; 
    let utility=req.body.utility;
    let homeType=req.body.homeType;
    let location=req.body.location;
    try {
        if (typeof utility === 'string') {
            utility = JSON.parse(utility);
        }
        if (typeof homeType === 'string') {
            homeType = JSON.parse(homeType);
        }
        if (typeof location === 'string') {
            location = JSON.parse(location);}
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Invalid JSON data" });
        return;
    }
   

    if (profileImgDelete !== '') {
        const filter = { _id: productId };
        const update = { $pull: { selectedImages: { filename: { $in: profileImgDelete } } } };
        const options = { new: true }; // Return the updated document

        // Update the product document
        const updatedProduct = await product.findOneAndUpdate(filter, update, options);

        if (updatedProduct) {
            console.log(`Selected images ${profileImgDelete} removed from product ${productId}`);
        } else {
            console.log(`Failed to remove selected images from product ${productId}`);
        }
    }

    const files = req.files;
    const selectedImages = [];
    if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
            const { filename, size } = files[i];
            selectedImages.push({
                filename,
                size
            });
        }
    }
    else {
        res.status(400)
        throw new Error("Please provide all images")
    }
    const currentProduct = await product.findById(productId);
    const updatedSelectedImages = currentProduct.selectedImages.concat(selectedImages);
    const homes = await product.findByIdAndUpdate(productId, {
        title: req.body.title,
        price: req.body.price,
        selectedImages:updatedSelectedImages,
        location,
        description: req.body.description,
        propertyFor: req.body.showProFor,
        bedRoom: req.body.bedroomCounter,
        bathRoom: req.body.bathroomCounter,
        phoneNumber: req.body.phoneNumber,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        whatsapp: req.body.whatsapp,
        utility,
        homeType
    }, { new: true })
    
    if (homes) {
        res.status(201).json({ message: "success" })
    }
    else {
        res.status(404).json({ message: "invalid data" })
    }

















    // console.log(req.body)
    // console.log(req.files)
})

const DeleteOneHome = asyncHandler(async (req, res) => {
    const productId = req.body.id;
    const deletedProduct = await product.findByIdAndDelete({
        _id: productId,
        postedBy: req.user.id
    });

    if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
});


module.exports = {
    getHomes,
    postHomes,
    DeleteOneHome,
    updateHome,
    getUserHomes,
    getAllHomes
}