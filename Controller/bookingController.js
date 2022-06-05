let SK="sk_test_51KXIRcSIU0rl5hVyAPp6Bkwnt3dHc6Pwfh9yIBiT1BhfuyXyH9JimHoW9CARk2Yu2cfhYJqBn0zdrploygAB42tW00iH75wOv4"
const stripe=require('stripe')(SK);
const planModel=require('../models/planModel');
const userModel=require('../models/userModel');

module.exports.createSession=async function createSession(){
    try{
        let userId=req.id;
        let planId=req.params.id;

        const user=await userModel.findById(userId);
        const plan=await planModel.findById(planId);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            client_reference_id:plan.id,         
            line_items: [{
                name: plan.name,
                description:plan.description,
                //deploy website
                amount:plan.price,
                quantity: 1
            }],

            success_url: `${req.protocol}://${req.get("host")}/profile`,
            cancel_url: `${req.protocol}://${req.get("host")}/profile`
          })
          res.status(200).json({
              status:"success",
              session
          })
        }
    catch(err){
        res.status(500).json({
            err:err.message
        })
    }
}