/**
 * The database router to handle router urls. All router.method here can be used by api for CRUD request
 * to database
 * @author Jason Susanto
 */

/**
 * initialize express module and routers
 * @const
 */
const express = require("express");
const router = express.Router();

/**
 * import functions frmo controller
 */
const databaseController = require("../controllers/Database-controller");

/**
 * post method for adding meal
 * @function
 * @param {string} urlPath - url
 * @param {function} handlers - function to be executed
 */
router.post("/meal/add", databaseController.addMeal)

/**
 * post method for adding user
 * @param {string} urlPath - url
 * @param {function} handlers - function to be executed
 */
router.post("/user/add", databaseController.addUserInfo)

/**
 * get method for goal and progress of nutrients
 * @function
 * @param {string} urlPath - url
 * @param {function} handlers - function to be executed
 */
router.get("/user/getNutrientGoalAndProgress", databaseController.getNutrientGoalAndProgress)

/**
 * get method for meal eaten in the day
 * @function
 * @param {string} urlPath - url
 * @param {function} handlers - function to be executed
 */
router.get("/user/getMealProgress", databaseController.getDailyMealProgress)

/**
 * get method for what happens when next day occurs
 * @function
 * @param {string} urlPath - url
 * @param {function} handlers - function to be executed
 */
router.get("/user/nextDay", databaseController.nextDay)

/**
 * get method for list of days
 * @function
 * @param {string} urlPath - url
 * @param {function} handlers - function to be executed
 */
router.get("/user/getMealHistory", databaseController.getMealHistory)

module.exports = router;
