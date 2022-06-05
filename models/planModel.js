//connect Mongodb through mongoose
const mongoose=require('mongoose');
const db_link='mongodb+srv://Ayush895:ayush895@cluster0.8yefz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(db_link)
.then(function(db){
    // console.log(db);
    console.log('plan db connected');
})
.catch(function(err){
    console.log(err);
});

const planSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxLength:[20,'plan name should not exceed more than 20 characters']
    },
    duration:{
        type:Number,
        required:true      
    },
    price:{
        type:Number,
        required:[true,'price not entered']
    },
    ratingsAverage:{
        type:Number
    },
    discount:{
        type:Number,
        validate:[function(){
            return this.discount<100
        },'discount should not exceed price']
    },
    noOfReviews:{
        type:Number
    }
});

//model
const planModel=mongoose.model('planModel',planSchema);


// (async function createPlan(){
//     let planObj={
//         name:'SuperFood130',
//         duration:30,
//         price:1000,
//         ratingsAverage:5,
//         discount:20
//     }
//     let data=await planModel.create(planObj);
//     console.log(data);

    // //     const doc=new planModel(planObj);
    // // await doc.save();
// })
// ();


module.exports=planModel;