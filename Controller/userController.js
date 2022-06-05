const userModel=require('../models/userModel');

module.exports.getUser=async function getUser(req,res){
    let id=req.id;
    let user=await userModel.findById(id);
    // let allUsers=await userModel.findOne({name:"Ayush"});
   if(user){
       return res.json(user);
   }
    else{
        return res.json({
            message:'user not found '
        });
    }
}

// module.exports.postUser=function postUser(req,res){
//     console.log(req.body);
//     user=req.body;        // use get method in postman software
//     res.json({

//         message:"data received successfully",
//         user:req.body
//     });
// };

module.exports.updateUser=async function updateUser(req,res){
    // console.log('req.body-> ',req.body);
try{
    let id=req.params.id;
    let user=await userModel.findById(id);
    // user.confirmPassword=user.password;
    let dataToBeUpdated=req.body;
    if(user)
    {
        const keys=[];
        for(let key in dataToBeUpdated){
            keys.push(key);
        }

        for(let i=0;i<keys.length;i++){
            user[keys[i]]=dataToBeUpdated[keys[i]];
        }
    
        const updatedData=await user.save();
        res.json({
            message:"data updated successfully",
            data:user
        });
    }
    else{
        res.json({
        message:'user not found'
         })
    }
}
catch(err){
    res.json({
        message: err.message,
    });
}
};
module.exports.deleteUser=async function deleteUser(req,res)
{
    // users={};
try{
    // let user=await userModel.findOneAndDelete({name:'Abhisekh'});  //not a good way
    let id=req.params.id;
    let user=await userModel.findByIdAndDelete(id);
    if(!user)
    {
        res.json({
            message:'user not found'
        })
    }
    res.json({
        message:"data has been deleted",
        data:user
    });
}
catch(err){
    res.json({
        message:err.message
    });
}
};

module.exports.getAllUser=async function getAllUser(req,res){
    let users=await userModel.find();
    if(users){
        res.json({
            message:'users retrieved',
            data:users
        });
    }
}
    // res.json({
    //     message:"req received",
    //     data:obj
    // });
    

// function setCookies(req,res){
//     // res.setHeader('Set-Cookie','isLoggedIn=true');
//     res.cookie('isLoggedIn',true,{maxAge:1000*60*60*24,secure:true,httpOnly:true});
//     // res.cookie('isPrimeMember',true);  //if we not use httpOnly function then our cookie is not secured
//     res.send('cookies has been set');
// }

// function getCookies(req,res){
//     let cookies=req.cookies.isLoggedIn;
//     console.log(cookies);
//     res.send('cookies received');
// }

module.exports.updateProfileImage=function updateProfileImage(req,res){
    res.json({
        message:'file uploaded successfully'
    })
}