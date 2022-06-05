const express= require("express");
const userRouter=express.Router(); 
const multer=require('multer');
const userModel=require('../models/userModel');
const {getUser,getAllUser,updateUser,deleteUser, updateProfileImage}=require('../controller/userController');
// const { application } = require("express");
const {signup,login,isAuthorised,protectRoute,forgetPassword,resetPassword,logout}=require('../controller/authController');
// user options
userRouter
.route('/:id')
.patch(updateUser)
.delete(deleteUser)

userRouter
.route('/signup')
.post(signup)

userRouter
.route('/login')
.post(login)

//forgetPassword
userRouter
.route('/forgetPassword')
.post(forgetPassword)

//resetPassword
userRouter
.route('/resetPassword/:token')
.post(resetPassword)

//multer for fileupload

//upload-> storage ,filter

const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images')
    },
    filename:function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`)
    }
});

const filter=function(req,file,cb){
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }
    else{
        cb(new Error("Not an Image! Please upload an image"),false)
    }
    }

const upload=multer({
    storage:multerStorage,
    fileFilter:filter
})





//logout
userRouter
.route('/logout')
.get(logout)

userRouter
.post("/ProfileImage",upload.single('photo'),updateProfileImage);

userRouter
.get('/ProfileImage',(req,res)=>{
    res.sendFile("C:/Users/Dell/Desktop/Backend/Day-39/multer.html");
});

//profile page
userRouter.use(protectRoute);
userRouter
.route('/userProfile')
.get(getUser)


//admin specific function
userRouter.use(isAuthorised(['admin']));
userRouter
.route('/')
.get(getAllUser)




module.exports=userRouter;