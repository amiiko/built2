const express=require('express')
const router=express.Router()
const {getUser,registerUser,loginUser,isLoggedIn,DeleteAllUsers,updateProfilePic,information,emailChange,passwordChange}=require('../Controllers/userControllers')
const {postHomes,DeleteOneHome,getHomes,updateHome,getUserHomes,getAllHomes}=require('../Controllers/postHomeControllers')
const {getMessages,getUserSearch,getRoomMessage}=require('../Controllers/messageController')
const {getSearch}=require('../Controllers/Search')
const {getNotification}=require('../Controllers/notificationController')
const {authProtect}=require('../middleware/authMiddleware')
const {postFavorite,getFavorite}=require('../Controllers/favoriteController')
const {postView,getView}=require('../Controllers/viewControllers')
const multer=require('multer')
var path = require('path')

const storage=multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'./public/profileImg/')
    },
    filename: function (req,file,cb){
        const uniqueSuffix=Date.now()+ Math.floor(Math.random()* 1E9)
        const filename = uniqueSuffix  + path.extname(file.originalname)
        cb(null , filename)
    }

})

const upload = multer({ storage: storage })


const storageProfile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/profilePhoto/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + Math.floor(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    }
}); 

const uploadProfile = multer({ storage: storageProfile });

router.get('/',authProtect, getUser)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/isloggedin',authProtect, isLoggedIn)
router.delete('/login/:id', DeleteAllUsers)


router.post('/property/add',[authProtect,upload.array('profileImg')], postHomes)
router.post('/property/delete',authProtect, DeleteOneHome)
router.get('/property/get', getHomes)
router.get('/property/getalllisting', getAllHomes)
router.get('/property/getuserdata',authProtect, getUserHomes)
router.put('/property/update',[authProtect,upload.array('profileImg')], updateHome)


router.get('/chat',authProtect, getMessages)
router.get('/chat/room',authProtect, getRoomMessage)
router.get('/search',authProtect, getUserSearch)


router.get('/s',getSearch)



//favorite
router.get('/favorites',authProtect, getFavorite)
router.post('/favorite',authProtect, postFavorite)

//view
router.get('/view',authProtect, getView)
router.post('/view', postView)
// router.delete('/search',authProtect, getUserSearch)

// profile update
router.post('/profile/pic',[authProtect,uploadProfile.single('profilePhoto')], updateProfilePic)
router.post('/profile/info',authProtect, information)
router.post('/profile/email',authProtect, emailChange)
router.post('/profile/pass',authProtect, passwordChange)

//Notification
router.get('/notification',authProtect, getNotification)

// router.put('/:id', updateUser)
// router.delete('/:id', deleteUser)

module.exports=router