/**
 * The external api controller to hold the logic. All functions has been edited to accomodate for extenral api requests
 * @author Jason Susanto
 */

/**
 * import models
 * @type {e | (() => Express)}
 */
const express = require("express")
const router = express.Router()
const nutritionixController = require("../controllers/Nutritionix-controller")


/**
 * fetch nutrient parsing
 * @function
 * @param req - the request recieved
 * @param res - the response given back
 */
router.post("/freeform-input/parse", nutritionixController.parseFreeformToMeal)

/**
 * fetch meal suggestions
 * @function
 * @param req - the request recieved
 * @param res - the response given back
 */
router.get("/suggestion/suggestMeal", nutritionixController.suggestMeal)

module.exports = router
