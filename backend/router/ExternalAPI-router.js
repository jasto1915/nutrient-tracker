const express = require("express")
const router = express.Router()
const nutritionixController = require("../controllers/Nutritionix-controller")


router.post("/freeform-input/parse", nutritionixController.parseFreeformToMeal)

module.exports = router
