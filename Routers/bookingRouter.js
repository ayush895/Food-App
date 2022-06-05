const express=require('express');

const bookingRouter=express.Router();
const{protectRoute}=require('../Controller/authController');
const{createSession}=require('../Controller/bookingController')

bookingRouter
.post('/createSession',protectRoute,createSession)
bookingRouter
.get('/createSession',function(req,res){
    res.sendFile("C://Users//Dell//Desktop//Backend//Day-38//booking.html");
});

module.exports=bookingRouter;