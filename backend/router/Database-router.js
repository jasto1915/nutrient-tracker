const express = require("express");
const router = express.Router();
const databaseController = require("../controllers/Database-controller");


router.post("/meal/add", databaseController.addMeal)

router.post("/user/add", databaseController.addUserInfo)

router.get("/user/getNutrientGoal", databaseController.getNutrientGoal)

module.exports = router;
