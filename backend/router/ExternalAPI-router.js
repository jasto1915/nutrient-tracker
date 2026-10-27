/**
 * The external api router. All routes here forward external API requests to the controller.
 * @author Jason Susanto
 */

/**
 * import models
 * @type {e | (() => Express)}
 */
const express = require("express")
const router = express.Router()
const externalAPIController = require("../controllers/ExternalAPI-controller")


/**
 * fetch nutrient parsing
 * @function
 * @param req - the request received
 * @param res - the response given back
 */
router.post("/freeform-input/parse", externalAPIController.parseFreeformToMeal)

/**
 * fetch meal suggestions
 * @function
 * @param req - the request received
 * @param res - the response given back
 */
router.get("/suggestion/suggestMeal", externalAPIController.suggestMeal)

module.exports = router
