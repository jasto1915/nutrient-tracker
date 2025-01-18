
const axios = require("axios")

function parseMealJSON(response,time){
  let data = response.data.foods[0]
  return {name:data.food_name, serving_qty:data.serving_qty,
  serving_unit:data.serving_unit, serving_weight_grams:data.serving_weight_grams,
  calories: data.nf_calories, protein: data.nf_protein, time:time }

}
module.exports = {


  parseFreeformToMeal: async function (req, res) {
    console.log("received")
    let time = req.body.time
    let body = {
      query: req.body.text
    }

    let headers = {
      "x-app-id":"YOUR_NUTRITIONIX_APP_ID",
      "x-app-key":"YOUR_NUTRITIONIX_APP_KEY"
    }

    let url = 'https://trackapi.nutritionix.com/v2/natural/nutrients'
    let response = await axios.post(url,body, {headers:headers})
    console.log("received 2")
    //console.log(response.data)
    //console.log(response.data.foods[0].food_name)
    let result = parseMealJSON(response,time)
    res.send(result)

  }
}
