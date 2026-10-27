/**
 * The external API controller. Holds both outbound integrations: Nutritionix
 * for parsing free text into food items, and Spoonacular for recipe suggestions.
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
      servingUnit:data.serving_unit, servingWeightGram:data.serving_weight_grams,
      calories: data.nf_calories, protein: data.nf_protein, carbs: data.nf_total_carbohydrate,
      fats: data.nf_total_fat, time:time })
  }

  return tempList

}

/**
 * collapse a [{name, value}] list into a lookup keyed by name, so a macro can
 * be read by name instead of being searched for
 * @param entries - the stored macronutrient list
 * @returns {Object<string, number>} value by name, 0 when absent
 */
function byName(entries){
  let result = {}
  for(let entry of entries){
    result[entry.name] = entry.value
  }
  return {carbs: 0, fats: 0, protein: 0, ...result}
}

/**
 * how much of a macronutrient a single suggested meal should aim to provide
 * @param dailyGoal - the whole day's target for this macronutrient
 * @param consumed - how much has been eaten so far today
 * @returns {number} a third of the daily goal, capped at what is left, floored at 0
 */
function remainingTarget(dailyGoal, consumed){
  let remaining = dailyGoal - consumed
  if(remaining <= 0){
    return 0
  }
  return Math.min(dailyGoal / 3, remaining)
}

module.exports = {

  /**
   * request parsing of freeform language from nutritionix
   * @function
   * @param req - the request received
   * @param res - the response given back
   */
  parseFreeformToMeal: async function (req, res) {
    let time = req.body.time
    let body = {
      query: req.body.text
    }

    let headers = {
      "x-app-id": process.env.NUTRITIONIX_APP_ID,
      "x-app-key": process.env.NUTRITIONIX_APP_KEY
    }

    try {
      let url = 'https://trackapi.nutritionix.com/v2/natural/nutrients'
      let response = await axios.post(url, body, {headers: headers})

      let result = parseMealJSON(response,time)
      res.send({status:"success", meals: result})

    }catch(err){
      // Only log server-side. The raw axios error carries config.headers,
      // which includes the Nutritionix credentials.
      console.error(err.message)
      res.status(502).send({status:"failed", msg:"could not parse that meal, please try again"})
    }


  },

  /**
   * request recipe from spoonacular
   * @function
   * @param req - the request received
   * @param res - the response given back
   */
  suggestMeal: async function(req,res){
   try {
    let userDoc = await User.findOne({})
    if(userDoc == null){
      return res.status(409).send({status:"failed", msg:"there is no user"})
    }

    let dayDoc = await Day.findOne({dateId: userDoc.currentDateId})
    if(dayDoc == null){
      return res.status(409).send({status:"failed", msg:"there is no day to suggest against"})
    }

    let goals = byName(userDoc.macronutrients)
    let eaten = byName(dayDoc.macronutrientProgress)

    // Aim for a third of the daily goal, capped at whatever is actually left.
    // Previously carbs fell back to 0 once the goal was met while fats and
    // protein fell back to a full third - the three disagreed by accident.
    let carbs = remainingTarget(goals.carbs, eaten.carbs)
    let fats = remainingTarget(goals.fats, eaten.fats)
    let protein = remainingTarget(goals.protein, eaten.protein)

    let url = "https://api.spoonacular.com/recipes/findByNutrients"
    let params = {
      apiKey: process.env.SPOONACULAR_API_KEY,
      minCarb: carbs,
      minProtein: protein,
      minFat: fats,
      number: 3,
      random: true
    }
    let response = await axios.get(url, {params: params})
    res.send({status: "success", suggestionList: response.data})

   }catch(err){
      // Previously the catch only logged, then `response.data` was read
      // regardless - an unreachable Spoonacular took the whole process down.
      console.error(err.message)
      res.status(502).send({status:"failed", msg:"could not fetch suggestions, please try again"})
   }

  }
}
