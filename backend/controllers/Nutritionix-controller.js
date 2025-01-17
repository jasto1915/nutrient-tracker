
const axios = require("axios")


module.exports = {


  parseFreeformToMeal: async function (req, res) {
    console.log("received")
    console.log(req.body.text)
    let body = {
      query: "grape"
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
    res.send({text: response.data.foods[0].food_name})

  }
}
