const express= require("express");
const cookieParser=require('cookie-parser');

const app=express();  
// express.json() is a middleware function used in mainly post method request changes the data from frontend to json
app.use(express.json());  // Global middleware 
app.listen(3000);
app.use(cookieParser());


const userRouter=require('./Routers/userRouter');
// const authRouter=require('./Routers/authRouter');
const planRouter=require('./Routers/planRouter'); 
const reviewRouter=require('./Routers/reviewRouter'); 
const bookingRouter=require('./Routers/bookingRouter');
//base route, router to use
app.use("/user",userRouter);
// app.use("/auth",authRouter);
app.use("/plans",planRouter);
app.use('/review',reviewRouter);
app.use('/booking',bookingRouter);

const planModel=require('./models/planModel');

