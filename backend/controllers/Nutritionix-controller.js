
const axios = require("axios")
const Day = require("../model/Day");
const User = require("../model/User");

function parseMealJSON(response,time){
  let data = response.data.foods[0]
  return {name:data.food_name, servingQty:data.serving_qty,
  servingUnit:data.serving_unit, servingWeightGrams:data.serving_weight_grams,
  calories: data.nf_calories, protein: data.nf_protein, time:time }

}
module.exports = {


  parseFreeformToMeal: async function (req, res) {
    let time = req.body.time
    let body = {
      query: req.body.text
    }

    let headers = {
      "x-app-id":"YOUR_NUTRITIONIX_APP_ID",
      "x-app-key":"YOUR_NUTRITIONIX_APP_KEY"
    }
    //use try catch
    let url = 'https://trackapi.nutritionix.com/v2/natural/nutrients'
    let response = await axios.post(url,body, {headers:headers})
    //console.log(response.data)
    //console.log(response.data.foods[0].food_name)
    let result = parseMealJSON(response,time)
    res.send(result)

  },

  suggestMeal: async function(req,res){
    let userDoc = await User.findOne({})
    console.log(userDoc.currentDate)
    let dayDoc = await Day.findOne({date: userDoc.currentDate})
    let carbs = [0,0]
    let fats = [0,0]
    let protein= [0,0]
    userDoc.macronutrients.forEach(item => item.name === "carbs" ? carbs[0] = item.value :
    item.name === "fats" ? fats[0] = item.value : item.name === "protein" ? protein[0] = item.value : item)

    console.log(dayDoc)
    console.log(dayDoc.macronutrientProgress)
    dayDoc.macronutrientProgress.forEach(item => item.name === "carbs" ? carbs[1] = item.value :
      item.name === "fats" ? fats[1] = item.value : item.name === "protein" ? protein[1] = item.value : item )

    carbs = (carbs[0]/3) >= carbs[1] ? carbs[0]/3: carbs[1]
    fats = (fats[0]/3) >= fats[1] ? fats[0]/3: fats[1]
    protein = (protein[0]/3) >= protein[1] ? protein[0]/3: protein[1]

    let url = "https://api.spoonacular.com/recipes/findByNutrients"
    let params = {
      apiKey: "YOUR_SPOONACULAR_API_KEY",
      minCarb: carbs - 2,
      maxCarb: carbs + 2,
      minProtein: protein - 2,
      maxProtein: protein + 2,
      minFat: fats - 2,
      maxFat: fats + 2,
      number: 3,
      random: true
    }
    try {
      let response = await axios.get(url, {params: params})
      //console.log(response.data)
      //console.log(response.data.foods[0].food_name)
    }catch(err){
      console.log(err)
    }
    console.log(response.data)
    res.send({status: "success", suggestionList: response.data})

  }
}
