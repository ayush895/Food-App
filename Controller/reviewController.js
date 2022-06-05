const reviewModel=require('../models/reviewModel')
const planModel=require('../models/planModel')

module.exports.getAllReviews=async function getAllReviews(req,res){
    try{
        const reviews=await reviewModel.find();
        if(reviews){
            return res.json({
                message:"reviews retrieved",
                data:reviews
            })
        }
        else{
            return res.json({
                message:'reviews not found'
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports.top3reviews=async function top3reviews(req,res){
    try{
        const reviews=await reviewModel.find().sort({
            rating:-1
        }).limit(3);
        if(reviews){
            return res.json({
                message:"reviews retrieved",
                data:reviews
            })
        }
        else{
            return res.json({
                message:'review not found'
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports.getPlanReviews=async function getPlanReviews(req,res){
    try{
        //plan click -> give corresponding reviews 
        let planid=req.params.id;
        let reviews=await reviewModel.find();
        reviews=reviews.filter(review => review.plan._id==planid);
            return res.json({
                message:"reviews retrieved for a particular plan",
                data:reviews
            });
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports.createReview = async function createReview(req,res){
    try {
        const id = req.params.plan;
        const plan = await planModel.findById(id);
            if(plan){
            const reviews = await reviewModel.find();
            let review = await reviewModel.create(req.body);
            const planReviews = reviews.filter(review=> review.plan._id==id)
            plan.noOfReviews = planReviews.length;
            plan.ratingsAverage = ((plan.ratingsAverage*plan.noOfReviews)+(req.body.rating))/(plan.noOfReviews+1);
                console.log(plan.ratingsAverage);
            await review.save()
            return res.json({
                message:'review created',
                data:review
            })
        }else{
            return res.json({
                message:'plan not found'
            })
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
}

module.exports.updateReview=async function updatedReview(req,res){
    try{
        let planid=req.params.id;
        //review id from frontend
        let id=req.body.id;
        let dataToBeUpdated=req.body;
        // console.log(id)
        // console.log(dataToBeUpdated)
        let Keys=[];
        for(let key in dataToBeUpdated)
        {
            if(key=='id')
            continue;
            Keys.push(key);
        }
        let review=await reviewModel.findById(id);
        for(let i=0;i<Keys.length;i++){
            review[Keys[i]]=dataToBeUpdated[Keys[i]];
        }
        // console.log(plan);
        //doc
        await review.save();
        return res.json({
            message:'review updated successfully',
            data:review
        });
    }
    catch(err)
    {
    res.status(500).json({
        message:err.message
    })
    }
}

module.exports.deleteReview = async function deleteReview(req,res){
    try {
        let planid = req.params.id;
        //review id from frontend
        let id=req.body.id;
            let review = await reviewModel.findByIdAndDelete(id);
            return res.json({
                message:'review deleted',
                data:review
            });
        }
    catch (err) {
        res.json({
            message:error.message
        })
    }
}
