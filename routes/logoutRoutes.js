const express=require('express')
const router=express.Router()
const {logout}=require('../Controllers/Logout')
const {authProtect}=require('../middleware/authMiddleware')

router.delete('/logout',authProtect, logout)

module.exports=router