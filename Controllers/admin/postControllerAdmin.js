const product = require('../../model/productModel')
const asyncHandler = require('express-async-handler')


//get homes for admin
//method get 
//path / 
//access private
const getAllHomesAdmin = asyncHandler(async (req, res) => {
    try {
        const { type } = req.body
        
        if (type === "published") {
            const homes = await product.find({ status: "published" });
            if (homes) {
                res.status(200).json(homes);
            } else {
                res.status(404).json({ message: "invalid data" });
            }
        }
        else if (type === "rejected") {
            const homes = await product.find({ status: "rejected" });
            if (homes) {
                res.status(200).json(homes);
            } else {
                res.status(404).json({ message: "invalid data" });
            }
        }
        else if (type === "pending") {
            const homes = await product.find({ status: "pending" });
            if (homes) {
                res.status(200).json(homes);
            } else {
                res.status(404).json({ message: "invalid data" });
            }
        }
        else{
            res.status(404).json({ message: "invalid data" });
        }

        

    } catch (err) {
        res.status(404).json({ message: "", error: err });
    }
});

const putStatusHomeAdmin=asyncHandler(async (req, res) => {
    try {
            
        const { type,productId } = req.body
        
        if (type === "published") {
            const homes = await product.findByIdAndUpdate(productId, {
                status:"published"
            }, { new: true })
            if (homes) {
                res.status(200).json(homes);
            } else {
                res.status(404).json({ message: "invalid data" });
            }
        }
        
        else if (type === "rejected") {
            const homes = await product.findByIdAndUpdate(productId, {
                status:"rejected"
            }, { new: true })
            if (homes) {
                res.status(200).json(homes);
            } else {
                res.status(404).json({ message: "invalid data" });
            }
        }
        else if (type === "pending") {
            const homes = await product.findByIdAndUpdate(productId, {
                status:"pending"
            }, { new: true })
            if (homes) {
                res.status(200).json(homes);
            } else {
                res.status(404).json({ message: "invalid data" });
            }
        }
        else{
            res.status(404).json({ message: "invalid data" });
        }


    } catch (err) {
        res.status(404).json({ message: "", error: err });
    }
});





module.exports = {
    getAllHomesAdmin,
    putStatusHomeAdmin
}