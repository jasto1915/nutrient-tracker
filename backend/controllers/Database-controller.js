
const Meal = require('../model/Meal');
const User = require('../model/User');

module.exports = {


  addMeal: async function (req, res) {
    try{
      let body = req.body
      //{name: body.name, servingQty:body.servingQty,servingUnit:body.servingUnit,
      //         servingWeightGram:body.servingWeightGram,protein:body.protein,calories:body.calories,time:body.time}
      let mealDoc = new
      Meal(body)
      await mealDoc.save()

      res.send({status:"success"})

    }catch(err){
      res.send({status:"failed, please try again"})
    }

  },

  addUserInfo: async function (req, res) {
    try{
      let body = req.body
      let userDoc = new
      User(body)
      await userDoc.save()

      res.send({status:"success"})

    }catch(err){
      res.send({status:"failed, please try again"})
    }


  }



}
