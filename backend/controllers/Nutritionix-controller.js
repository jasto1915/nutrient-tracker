
const axios = require("axios")


module.exports = {


  parseFreeformToMeal: async function (req, res) {
    let body = {
      query: "grape"
    }

    let headers = {
      "x-app-id":"YOUR_NUTRITIONIX_APP_ID",
      "x-app-key":"YOUR_NUTRITIONIX_APP_KEY"
    }

    let url = 'https://trackapi.nutritionix.com/v2/natural/nutrients'
    let response = await axios.post(url,body, {headers:headers})

    res.send(response.data)

  }
}
