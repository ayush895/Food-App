const express= require("express");
const planRouter=express.Router(); 
const {isAuthorised}=require('../Controller/authController')
const{protectRoute}=require('../Controller/authController')
const{getPlan,getAllPlans,createPlan,updatePlan,deletePlan,top3plans}=require('../Controller/planController')

//all plans
planRouter
.route('/allPlans')
.get(getAllPlans)

//own plan
planRouter.use(protectRoute);
planRouter
.route('/plan/:id')
.get(getPlan)

planRouter
.route('/top3plans')
.get(top3plans)

//admin and restaurant owner can only create,update or delete plans
planRouter.use(isAuthorised(['admin','restaurantowner']));
planRouter
.route('/crudPlan')
.post(createPlan)

planRouter
.route('/crudPlan/:id')
.patch(updatePlan)
.delete(deletePlan)

module.exports=planRouter;