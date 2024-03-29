//mongoDB
const mongoose=require('mongoose');
const emailValidator=require('email-validator'); 
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const db_link='mongodb+srv://Ayush895:ayush895@cluster0.8yefz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(db_link)
.then(function(db){
    // console.log(db);
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
});

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
            return emailValidator.validate(this.email);
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    confirmPassword:{
        type:String,
        required:false,
        minLength:8,
        validate:function(){
            return this.confirmPassword==this.password
        }
    },
    role:{
        type:String,
        enum:['admin','user','restaurantowner','deliveryboy'],
        default:'user'
    },
    profileImage:{
        type:String,
        default:'img/users/default/jpeg'
    }
});

//pre post hooks

//after save event occurs in db
// userSchema.post('save',function(doc){
//     console.log('after saving in db',doc);
// });

// //before save event occurs in db
// userSchema.pre('save',function(){
//     console.log('before saving in db',this);
// });

userSchema.pre('save',function(){
    this.confirmPassword=undefined;
})

// userSchema.pre('save',async function(){
//     let salt=await bcrypt.genSalt();
//     let hashedString= await bcrypt.hash(this.password,salt);
//     console.log(hashedString);
//     this.password=hashedString;
// })

userSchema.methods.createResetToken=function(){
    //creating unique token using npm i crypto
    const resetToken=crypto.randomBytes(32).toString("hex");
    this.resetToken=resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler=function(){
    this.password=password;
    this.confirmPassword=confirmPassword;
    this.resetToken=undefined;
}


//model
const userModel=mongoose.model('userModel',userSchema);
module.exports=userModel;