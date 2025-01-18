
const Meal = require('../model/Meal');

module.exports = {


  addMeal: async function (req, res) {
    try{
      let body = req.body
      let mealDoc = new
      Meal({name: body.name, servingQty:body.servingQty,servingUnit:body.servingUnit,
        servingWeightGram:body.servingWeightGram,protein:body.protein,calories:body.calories,time:body.time})
      await mealDoc.save()

    }catch(err){

    }

  }



}
