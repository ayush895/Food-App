const express= require("express");
const authRouter=express.Router();
const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');
const {JWT_key}=require('../secrets');
const {sendMail}=require("../utility/nodemailer");
//sign up user
module.exports.signup=async function signUp(req,res){
try{   
    let obj=req.body;
    let user=await userModel.create(obj);
    // console.log(user);
    sendMail("signup",user);
    if(user)
    {
    res.json({
        message:"user signed up",
        data:user
    });
    }
    else{
        res.json({
            message:"error while signing up",
            data:user
        });
    }
}
catch(err)
{
    res.json({
        message:err.message
    });
}
}

//login user
module.exports.login=async function login(req,res){
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

    //isAuthorised -> to check the user's role[user,admin,restaurantowner,delieveryboy]

module.exports.isAuthorised=function isAuthorised(roles){
    return function(req,res,next){
        if(roles.includes(req.role)==true){
            // console.log("ijcdw");
            next();
        }
        else{
            res.status(401).json({
                message:'operation not allowed'
            });
        }
        
    }
}

//protectRoute

module.exports.protectRoute=async function protectRoute(req,res,next){
try{
    let token;
    if(req.cookies.login)
    {
        // console.log(req.cookies);
        token=req.cookies.login;
        let payload=jwt.verify(token,JWT_key);
        if(payload){
            console.log('payload token',payload);
        const user=await userModel.findById(payload.payload);
        req.role=user.role;
        req.id=user.id;

        next();
        }
        else{
            
            //browser
            const client=req.get('User-Agent');
            if(client.includes("Mozilla")==true){
                return res.redirect('/login');
            }
            //postman
            res.json({
                message:'Please login'
            })
        }
    }
    else{
         return res.json({
            message:'Please login again'
        })
    }
}
catch(err){
    res.json({
        message:err.message
    });
}
}

//forgetPassword
module.exports.forgetPassword=async function forgetPassword(req,res){
    let{email}=req.body;
    try{
        const user=await userModel.findOne({email:email})
        if(user){
            //createResetToken is used to create a new token
        const resetToken=user.createResetToken();
            
            let resetPasswordLink=`${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;

            sendMail('resetPassword',{email:email,resetPasswordLink:resetPasswordLink})
            return res.json({
                message:resetPasswordLink
            })            //send email to the user by nodemailer
        }
        else
        {
            return res.json({
                message:"please signup"
            });
        }
    }
    catch(err)
    {
        res.status(500).json({
            message:err.message
        });
    }
}

//resetPassword
module.exports.resetPassword=async function resetPassword(req,res){
try{
    const token=req.params.token;
    let{password,confirmPassword}=req.body;
    const user=await userModel.findOne({resetToken:token});
    if(user){
    //resetPasswordHandler will update user password in db
    user.resetPasswordHandler(password,confirmPassword);
    await user.save();
    res.json({
        message:"password changed successfully,login again"
    })
    }
    else{
        res.json({
            message:"user not found"
        });
    }

}
catch(err)
{
res.json({
    message:err.message
})
}
}

//logout function
module.exports.logout=function logout(req,res)
{
    res.cookie('login',' ',{maxAge:1});
    res.json({
        message:"user logged out successfully"
    })
}