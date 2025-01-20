
const Meal = require('../model/Meal')
const User = require('../model/User')
const Day = require('../model/Day')

let dayCount = 0
let currentDate = new Date(2025,0,20)
let dateUpdated = false

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

  if(goal =="Gain Weight"){
    result += 500
  }else{
    result -= 500
  }

  return result

}

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


  addMeal: async function (req, res) {
    try{
      let body = req.body
      //{name: body.name, servingQty:body.servingQty,servingUnit:body.servingUnit,
      //         servingWeightGram:body.servingWeightGram,protein:body.protein,calories:body.calories,time:body.time}
      let mealDoc = new
      Meal(body)
      await mealDoc.save()

      if(!dateUpdated) {
        currentDate.setDate(currentDate.getDate() + (dayCount - 1)) //change currentDate object
        dateUpdated = true
      }
      let currentDay = await Day.findOne({date:currentDate})

      currentDay.mealList.push(mealDoc._id)
      currentDay.macronutrientProgress.forEach(
        (item) => item.name === "calories" ? item.value += body.calories :
        item.name === "protein" ? item.value += body.protein : item )
      //currentDay.macronutrientProgress.push({name:"protein", value:body.protein})
      //not good for extensibility
      // forEach(
      //   (item) => item.name === "calories" ? item.value += body.calories :
      // item.name === "protein" ? item.value += body.protein : item )
      await currentDay.save()


      res.send({status:"success"})

    }catch(err){
      console.log(err)
      res.send({status:"failed, please try again"})
    }

  },

  addUserInfo: async function (req, res) {
    try{
      let user = req.body
      let dailyCalorie =
        calculateTotalDailyCalories(user.gender, user.weight, user.height, user.age, user.activityLevel,user.goal)
      let [protein,carbs,fats] = calculateMacronutrients(dailyCalorie,user.goal)

      let data =
        {
          name: user.name, gender: user.gender, weight: user.weight, height: user.height,
          age: user.age, activityLevel: user.activityLevel, goal: user.goal, dailyCalorie: dailyCalorie,
          macronutrients: [{name: "protein", value: protein},{name: "carbs", value: carbs},
          {name: "fats", value: fats}], currentDate: currentDate
        }

      let userDoc = new User(data)
      await userDoc.save()

      let dayDoc = new
      Day({date:currentDate, macronutrientProgress:[
          {name: "calories", value: 0},
          {name: "protein", value: 0},
          {name: "carbs", value: 0},
          {name: "fats", value: 0},
        ], mealList: []})
      await dayDoc.save()
      dayCount += 1

      res.send({status:"success"})

    }catch(err){
      res.send({status:"failed", msg:"please try again"})
    }


  },

  getNutrientGoal: async function (req, res) {
    try {
      let userData = await User.findOne({})
      let calorie
      let nutrients

      if(userData != null) {
        calorie = {name: "calories", value: userData.dailyCalorie}
        nutrients = [calorie, ...userData.macronutrients]

        let dayData = await Day.findOne({date:currentDate})
        let finalResult = []
        for(let progress of dayData.macronutrientProgress){
          for(let nutrient of nutrients){
            if(nutrient.name === progress.name){
              finalResult.push({name:nutrient.name, value: progress.value,max:nutrient.value})
              break
            }
          }
        }

        //console.log(finalResult)
        res.send({status:"success",nutrients: finalResult, goal:userData.goal})

      }else{
        res.send({status:"failed", msg:"there is no user"})
      }

    }catch(err){
      res.send({status:"failed", msg:"please try again"})
    }
  },

  getDailyNutrientProgress: async function(req,res){
    try{
      let data = await Day.findOne({date:currentDate})

      res.send({status:"success", calories:data.calorieProgress, protein:data.proteinProgress})

    }catch(err){
      res.send({status:"failed"})
    }

  },

  getDailyMealProgress: async function(req,res){
    try{

      let data = await Day.findOne({date:currentDate}).populate("mealList")
      let breakfast = []
      let lunch = []
      let dinner = []

      //console.log("started")
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

  nextDay: async function(req,res){
    try {
      console.log('here')
      dayCount += 1
      currentDate.setDate(currentDate.getDate() + 1)
      let dayDoc = new
      Day({
        date: currentDate, macronutrientProgress: [
          {name: "calories", value: 0},
          {name: "protein", value: 0},
          {name: "carbs", value: 0},
          {name: "fats", value: 0},
        ], mealList: []
      })
      await dayDoc.save()

      let userDoc = await User.findOne({})
      userDoc.currentDate = currentDate;
      await userDoc.save()

      console.log("here1")
      res.send({status:"success"})

    }catch(err){
      console.log("err")
    }

  },

  getMealHistory: async function(req,res){
    console.log("here2")
    try {
      let dayList = await Day.find({})

      res.send({status: "success", historyList: dayList})

    }catch(err){
      console.log("err")
    }

  }



}
