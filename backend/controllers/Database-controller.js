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

/**
 * Activity multipliers, keyed by the exact values the activity-level dropdown submits.
 * @const
 */
const ACTIVITY_MULTIPLIERS = {
  "Sedentary": 1.2,
  "Lightly Active": 1.375,
  "Moderately Active": 1.55,
  "Very Active": 1.725,
  "Extra Active": 1.9,
}

/**
 * A day is keyed by its calendar date as YYYY-MM-DD. Using the day-of-month
 * alone would collide across months.
 * @param {Date} date
 * @returns {string} date id
 */
function toDateId(date){
  return date.toISOString().slice(0,10)
}

/**
 * today's date id
 * @returns {string} date id
 */
function todayId(){
  return toDateId(new Date())
}

/**
 * shift a date id by a whole number of days
 * @param {string} dateId - YYYY-MM-DD
 * @param {number} days - days to add
 * @returns {string} the shifted date id
 */
function addDays(dateId, days){
  let date = new Date(dateId + "T00:00:00Z")
  date.setUTCDate(date.getUTCDate() + days)
  return toDateId(date)
}

/**
 * validate a user payload before it reaches the model
 * @param user - the submitted body
 * @returns {string|null} an error message, or null when the payload is usable
 */
function validateUser(user){
  if(user == null || typeof user !== "object"){
    return "no user details were submitted"
  }
  if(!user.name || String(user.name).trim() === ""){
    return "name is required"
  }
  if(!["Male","Female"].includes(user.gender)){
    return "gender must be Male or Female"
  }
  if(ACTIVITY_MULTIPLIERS[user.activityLevel] === undefined){
    return "please choose an activity level"
  }
  if(!["Lose Weight","Gain Weight"].includes(user.goal)){
    return "please choose a goal"
  }
  for(let field of ["age","height","weight"]){
    let value = Number(user[field])
    if(!Number.isFinite(value) || value <= 0){
      return `${field} must be a positive number`
    }
  }
  return null
}

/**
 * validate a list of meals before they reach the model
 * @param meals - the submitted body
 * @returns {string|null} an error message, or null when the payload is usable
 */
function validateMeals(meals){
  if(!Array.isArray(meals) || meals.length === 0){
    return "no meals were submitted"
  }
  for(let meal of meals){
    if(meal == null || !meal.name){
      return "every meal needs a name"
    }
    if(!/^\d{2}:\d{2}$/.test(meal.time || "")){
      return "every meal needs a time in HH:MM format"
    }
    for(let field of ["calories","protein","carbs","fats"]){
      if(!Number.isFinite(Number(meal[field]))){
        return `${meal.name}: ${field} must be a number`
      }
    }
  }
  return null
}

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

  let multiplier = ACTIVITY_MULTIPLIERS[activityLevel]
  if(multiplier === undefined){
    // Fail loudly. Silently skipping this understated every target by up to 90%.
    throw new Error(`Unknown activity level: ${activityLevel}`)
  }
  result *= multiplier

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

      let invalid = validateMeals(body)
      if(invalid){
        return res.send({status:"failed", msg: invalid})
      }

      let userDoc = await User.findOne({})
      if(userDoc == null){
        return res.send({status:"failed", msg:"there is no user"})
      }

      let currentDay = await Day.findOne({dateId:userDoc.currentDateId})
      if(currentDay == null){
        return res.send({status:"failed", msg:"there is no day to add this meal to"})
      }

      for(let meal of body) {
        let mealDoc = new
        Meal(meal)
        await mealDoc.save()

        currentDay.mealList.push(mealDoc._id)
        // Math.round(item.value += x) rounded the return value and threw it
        // away, leaving the accumulated float in place.
        let eaten = {
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
        }
        currentDay.macronutrientProgress.forEach((item) => {
          if(eaten[item.name] !== undefined){
            item.value = Math.round(item.value + eaten[item.name])
          }
        })
      }

      await currentDay.save()


      res.send({status:"success"})

    }catch(err){
      console.error(err.message)
      res.send({status:"failed", msg:"could not save that meal, please try again"})
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

      let invalid = validateUser(user)
      if(invalid){
        return res.send({status:"failed", msg: invalid})
      }

      // Every read resolves the user with an unfiltered findOne(), so a second
      // user would be silently orphaned along with a duplicate Day.
      let existingUser = await User.findOne({})
      if(existingUser != null){
        return res.send({status:"failed", msg:"a user already exists"})
      }

      let dailyCalorie =
        calculateTotalDailyCalories(user.gender, user.weight, user.height, user.age, user.activityLevel,user.goal)
      let [protein,carbs,fats] = calculateMacronutrients(dailyCalorie,user.goal)

      let data =
        {
          name: user.name, gender: user.gender, weight: user.weight, height: user.height,
          age: user.age, activityLevel: user.activityLevel, goal: user.goal, dailyCalorie: Math.round(dailyCalorie),
          macronutrients: [{name: "protein", value: Math.round(protein)},{name: "carbs", value: Math.round(carbs)},
          {name: "fats", value: Math.round(fats)}], currentDateId: todayId()
        }

      let userDoc = new User(data)
      await userDoc.save()

      let dayDoc = new
      Day({date:todayId(), dateId:todayId(),macronutrientProgress:[
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

      // The user document is the single source of truth for which day is
      // current; deriving it separately here let the two drift apart.
      let userDoc = await User.findOne({})
      let data = await Day.findOne({dateId:userDoc.currentDateId}).populate("mealList")
      let breakfast = []
      let lunch = []
      let dinner = []

      //[{meal},{meal},...]
      for(let meal of data.mealList){
        let hour = parseInt(meal.time.slice(0,2))

        // An unparseable time used to match none of the branches, so the meal
        // disappeared from the day view while still counting towards progress.
        if(!Number.isInteger(hour) || hour < 0 || hour > 23){
          console.warn(`Meal "${meal.name}" has an unreadable time: ${meal.time}`)
          breakfast.push(meal)
          continue
        }

        //00.00 - 10.59 | 11.00 - 16.59 | 17.00 - 23.59
        if(hour <= 10){
          breakfast.push(meal)
        }else if(hour <= 16){
          lunch.push(meal)
        }else{
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

      userDoc.currentDateId = addDays(userDoc.currentDateId, 1);

      // Advancing twice onto the same day must not create a second Day document.
      let existingDay = await Day.findOne({dateId: userDoc.currentDateId})
      if(!existingDay){
        let dayDoc = new
        Day({
          date: userDoc.currentDateId, dateId:userDoc.currentDateId, macronutrientProgress: [
            {name: "calories", value: 0},
            {name: "protein", value: 0},
            {name: "carbs", value: 0},
            {name: "fats", value: 0},
          ], mealList: []
        })
        await dayDoc.save()
      }

      await userDoc.save()

      res.send({status:"success"})

    }catch(err){
      console.error(err.message)
      res.send({status:"failed", msg:"could not advance the day, please try again"})
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
      console.error(err.message)
      res.send({status:"failed", msg:"could not load history, please try again"})
    }

  }



}
