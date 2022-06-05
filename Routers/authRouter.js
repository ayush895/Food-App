const express= require("express");
const authRouter=express.Router();
const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');
const {JWT_key}=require('../secrets');
authRouter
.route('/signup')
.get(middleware,getSignUp,middleware2)
.post(postSignUp);

authRouter
.route('/login')
.post(loginUser)

function middleware(req,res,next){
    console.log("middleware encountered");
    next();
}

function middleware2(req,res){
    console.log("middleware2 encountered");
    // next();
    console.log("Middeware2 ended req/res cycle");
    res.sendFile('/public/signup.html',{root:__dirname});
}

function getSignUp(req,res,next)
{
    console.log("getSignup called");
next();
}

async function postSignUp(req,res){
    let obj=req.body;
    let user=await userModel.create(obj);
    // console.log(user);
    res.json({
        message:"user signed up",
        data:user
    });
}

async function loginUser(req,res){
try{
        let data=req.body;
        if(data.email){ 
                let user=await userModel.findOne({email:data.email});

                if(user)
                {
                    if(user.password==data.password)
                    {
                        let uid=user['_id']; //uid
                        let token=jwt.sign({payload:uid},JWT_key);
                        
                        res.cookie('login',token,{httpOnly:true});
                        
                        return res.json({
                            message:'User has logged in',
                            userDetails:data
                        })
                    }
                    else{
                        return res.json({
                            message:'wrong credentials'
                        })
                    }
                }
                else{
                    return res.json({
                        message:'User not found'
                    })
                }
            }
        else{
            return res.json({
                message:'Empty field found'
            })
   }
}
catch(err)
{
   return res.status(500).json({
       message:err.message
   });
}
}
module.exports=authRouter; 