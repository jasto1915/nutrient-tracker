/**
 * The external api controller to hold the logic. All functions has been edited to accomodate for CRUD requests
 * @author Jason Susanto
 */

/**
 * import models
 */
const axios = require("axios")
const Day = require("../model/Day");
const User = require("../model/User");

/**
 * parse the response from ext api
 * @param response api from response
 * @param time time of meal
 * @returns {*[]}
 */
function parseMealJSON(response,time){

  let tempList = []
  for(let data of response.data.foods) {
    tempList.push({name:data.food_name, servingQty:data.serving_qty,
      servingUnit:data.serving_unit, servingWeightGrams:data.serving_weight_grams,
      calories: data.nf_calories, protein: data.nf_protein, carbs: data.nf_total_carbohydrate,
      fats: data.nf_total_fat, time:time })
  }

  return tempList

}

module.exports = {

  /**
   * request parsing of freeform language from nutritionix
   * @function
   * @param req - the request recieved
   * @param res - the response given back
   */
  parseFreeformToMeal: async function (req, res) {
    let time = req.body.time
    let body = {
      query: req.body.text
    }

    let headers = {
      "x-app-id":"YOUR_NUTRITIONIX_APP_ID",
      "x-app-key":"YOUR_NUTRITIONIX_APP_KEY"
    }

    try {
      let url = 'https://trackapi.nutritionix.com/v2/natural/nutrients'
      let response = await axios.post(url, body, {headers: headers})

      let result = parseMealJSON(response,time)
      res.send({status:"success", meals: result})

    }catch(err){
      console.log(err)
      res.send({status:"failed", msg: err})
    }


  },

  /**
   * request recipe from spoonacular
   * @function
   * @param req - the request recieved
   * @param res - the response given back
   */
  suggestMeal: async function(req,res){
    let userDoc = await User.findOne({})
    let dayDoc = await Day.findOne({dateId: userDoc.currentDateId})

    let carbs = [0,0]
    let fats = [0,0]
    let protein= [0,0]

    userDoc.macronutrients.forEach(item => item.name === "carbs" ? carbs[0] = item.value :
    item.name === "fats" ? fats[0] = item.value : item.name === "protein" ? protein[0] = item.value : item)

    dayDoc.macronutrientProgress.forEach(item => item.name === "carbs" ? carbs[1] = item.value :
      item.name === "fats" ? fats[1] = item.value : item.name === "protein" ? protein[1] = item.value : item )

    let diffCarbs = (carbs[0] - carbs[1])
    let diffFats = (fats[0] - fats[1])
    let diffProtein = (protein[0] - protein[1])

    carbs = (carbs[0]/3) <= diffCarbs ? carbs[0]/3: diffCarbs <= 0 ? 0 : diffCarbs
    fats = (fats[0]/3) <= diffFats ? fats[0]/3: diffFats <= 0 ? fats[0]/3 : diffFats
    protein = (protein[0]/3) <= diffProtein ? protein[0]/3:  diffProtein <= 0 ? protein[0]/3 : diffProtein

    let url = "https://api.spoonacular.com/recipes/findByNutrients"
    let params = {
      apiKey: "YOUR_SPOONACULAR_API_KEY",
      minCarb: carbs,
      minProtein: protein,
      minFat: fats,
      number: 3,
      random: true
    }
    let response

    try {
      response = await axios.get(url, {params: params})

    }catch(err){
      console.log(err)
    }
    res.send({status: "success", suggestionList: response.data})

  }
}
