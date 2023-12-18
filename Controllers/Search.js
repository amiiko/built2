const product = require('../model/productModel');
const asyncHandler = require('express-async-handler');

const getSearch = asyncHandler(async (req, res) => {
  console.log()
  const lng = req.query.currentPostion.lng;
  const lat= req.query.currentPostion.lat;

 console.log(lng)
 console.log(lat)

 try {
  const result = await product.find({
    status: "published",
    location: {
     
        $geoWithin: {
        $centerSphere: [[lat, lng], 25.74944/ 6371]
        
      }
    }
  }).sort();

  res.json(result);
} catch (error) {
  console.error("Error in GeoSpatial query:", error);
  res.status(500).json({ error: "Internal Server Error" });
}})

module.exports = {
  getSearch
};