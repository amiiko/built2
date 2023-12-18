const express=require('express')
const router=express.Router()
const {getAllHomesAdmin,putStatusHomeAdmin}=require('../Controllers/admin/postControllerAdmin')
const {authProtect}=require('../middleware/authMiddleware')




// router.delete('/property/delete', DeleteAllHomes)
router.post('/property/get', getAllHomesAdmin)
router.put('/property/update',authProtect, putStatusHomeAdmin)

module.exports=router