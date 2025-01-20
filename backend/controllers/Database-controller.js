/**
 * The database controller to hold the logic. All functions has been edited to accomodate for CRUD requests
 * @author Jason Susanto
 */

/**
 * Model import
 * @const
 */
const Meal = require('../model/Meal')
const User = require('../model/User')
const Day = require('../model/Day')

let currentDate = new Date(2025,0,20)

/**
 * create calorie requirement
 * @param gender Male or female
 * @param weight number representing weight
 * @param height number representing height
 * @param age age
 * @param activityLevel enum of activity levels
 * @param goal lose or gain weight
 * @returns {number} calorie req
 */
function calculateTotalDailyCalories(gender, weight,height,age,activityLevel,goal){

  let result = 0

  if(gender === "Male"){
    result = 10 * weight + 6.25 * height - 5 * age + 5

  }else{
    result = 10 * weight + 6.25 * height - 5 * age - 161
  }

  switch(activityLevel){
    case "Sedentary":
      result *= 1.2
      break
    case "Lightly Active":
      result *= 1.375
      break
    case "Moderately Active":
      result *= 1.55
      break
    case "Very Active":
      result *= 1.725
      break
    case "Extra Active":
      result *= 1.9
      break
  }

  if(goal === "Gain Weight"){
    result += 500
  }else{
    result -= 500
  }

  return result

}

/**
 * calculate macronutrirent req
 * @param calories daily calorie
 * @param goal lose or gain weight
 * @returns {number[]} array of nutrients
 */
function calculateMacronutrients(calories, goal){
  let result

  if(goal === "Gain Weight"){
    //35p - 45c - 20f
    let protein = calories * 0.35 / 4
    let carbs = calories * 0.45 / 4
    let fats = calories * 0.2 / 9

    result = [protein, carbs, fats]

  }else{
    //30p - 45c - 25f
    let protein = calories * 0.3 / 4
    let carbs = calories * 0.45 / 4
    let fats = calories * 0.25 / 9

    result = [protein, carbs, fats]
  }

  return result

}


module.exports = {


  /**
   * add meal to database
   * @function
   * @param req - the request recieved
   * @param res - the response given back
   */
  addMeal: async function (req, res) {
    try{
      let body = req.body
      let userDoc = await User.findOne({})
      let currentDay = await Day.findOne({dateId:userDoc.currentDateId})
      for(let meal of body) {
        let mealDoc = new
        Meal(meal)
        await mealDoc.save()

        currentDay.mealList.push(mealDoc._id)
        currentDay.macronutrientProgress.forEach(
          (item) =>
            item.name === "calories" ? Math.round(item.value += meal.calories) :
            item.name === "protein" ? Math.round(item.value += meal.protein) :
              item.name === "carbs" ? Math.round(item.value += meal.carbs) :
                item.name === "fats" ? Math.round(item.value += meal.fats) : item)
      }

      await currentDay.save()


      res.send({status:"success"})

    }catch(err){
      console.log(err)
      res.send({status:"failed, please try again"})
    }

  },

  /**
   * add user and day to database
   * @function
   * @param req - the request recieved
   * @param res - the response given back
   */
  addUserInfo: async function (req, res) {
    try{
      let user = req.body
      let dailyCalorie =
        calculateTotalDailyCalories(user.gender, user.weight, user.height, user.age, user.activityLevel,user.goal)
      let [protein,carbs,fats] = calculateMacronutrients(dailyCalorie,user.goal)

      let data =
        {
          name: user.name, gender: user.gender, weight: user.weight, height: user.height,
          age: user.age, activityLevel: user.activityLevel, goal: user.goal, dailyCalorie: Math.round(dailyCalorie),
          macronutrients: [{name: "protein", value: Math.round(protein)},{name: "carbs", value: Math.round(carbs)},
          {name: "fats", value: Math.round(fats)}], currentDateId: currentDate.getDate()
        }

      let userDoc = new User(data)
      await userDoc.save()

      let dayDoc = new
      Day({date:currentDate, dateId:currentDate.getDate(),macronutrientProgress:[
          {name: "calories", value: 0},
          {name: "protein", value: 0},
          {name: "carbs", value: 0},
          {name: "fats", value: 0},
        ], mealList: []})
      await dayDoc.save()

      res.send({status:"success"})

    }catch(err){
      res.send({status:"failed", msg:"please try again"})
    }


  },

  /**
   * fetch nutrient goal and progress
   * @function
   * @param req - the request recieved
   * @param res - the response given back
   */
  getNutrientGoalAndProgress: async function (req, res) {
    try {
      let userData = await User.findOne({})
      let calorie
      let nutrients

      if(userData != null) {
        calorie = {name: "calories", value: userData.dailyCalorie}
        nutrients = [calorie, ...userData.macronutrients]

        let dayData = await Day.findOne({dateId:userData.currentDateId})

        let finalResult = []
        for(let progress of dayData.macronutrientProgress){
          for(let nutrient of nutrients){
            if(nutrient.name === progress.name){
              finalResult.push({name:nutrient.name, value: progress.value,max:nutrient.value})
              break
            }
          }
        }

        res.send({status:"success",nutrients: finalResult, goal:userData.goal})

      }else{
        res.send({status:"failed", msg:"there is no user"})
      }

    }catch(err){
      res.send({status:"failed", msg:"please try again"})
    }
  },

  /**
   * fetch meals eaten in the day
   * @function
   * @param req - the request recieved
   * @param res - the response given back
   */
  getDailyMealProgress: async function(req,res){
    try{

      let data = await Day.findOne({dateId:currentDate.getDate()}).populate("mealList")
      let breakfast = []
      let lunch = []
      let dinner = []

      //[{meal},{meal},...]
      for(let meal of data.mealList){
        let hour = parseInt(meal.time.slice(0,2))
        let minute = parseInt(meal.time.slice(3))

        //00.00 - 10.59 | 11.00 - 16.59 | 17.00 - 23.59
        if(hour >= 0 && (hour <= 10 && minute <= 59)){
          breakfast.push(meal)
        }else if(hour >= 11 && (hour <= 16 && minute <= 59)){
          lunch.push(meal)
        }else if(hour >= 17 && (hour <= 23 && minute <= 59)){
          dinner.push(meal)
        }
      }


      res.send({status:"success", breakfast: breakfast, lunch: lunch, dinner:dinner})


    }catch(err){
      res.send({status:"failed"})
    }
  },

  /**
   * create new day and reset parameters
   * @function
   * @param req - the request recieved
   * @param res - the response given back
   */
  nextDay: async function(req,res){
    try {
      let userDoc = await User.findOne({})

      userDoc.currentDateId += 1;
      currentDate.setDate(userDoc.currentDateId);

      let dayDoc = new
      Day({
        date: currentDate, dateId:userDoc.currentDateId, macronutrientProgress: [
          {name: "calories", value: 0},
          {name: "protein", value: 0},
          {name: "carbs", value: 0},
          {name: "fats", value: 0},
        ], mealList: []
      })
      await dayDoc.save()

      await userDoc.save()

      res.send({status:"success"})

    }catch(err){
      console.log(err)
      console.log("err")
    }

  },

  /**
   * fetch all days
   * @function
   * @param req - the request recieved
   * @param res - the response given back
   */
  getMealHistory: async function(req,res){
    try {
      let userDoc = await User.findOne({})
      let dayList = await Day.find({})
      let result = []

      for(let day of dayList){
        if(!(day.dateId === userDoc.currentDateId)){
          result.push(day)
        }
      }
      res.send({status: "success", historyList: result})

    }catch(err){
      console.log("err")
    }

  }



}
