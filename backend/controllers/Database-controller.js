
const Meal = require('../model/Meal')
const User = require('../model/User')
const Day = require('../model/Day')

let dayCount = 0
let currentDate = new Date(2025,1,20)

function calculateTotalDailyCalories(gender, weight,height,age,activityLevel,goal){

  let result = 0

  if(gender == "Male"){
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

  if(goal == "Gain Weight"){
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

      if(dayCount === 0){
        let dayDoc = new
        Day({date:currentDate, calorieProgress: body.calories, proteinProgress: body.protein,
          fatsProgress:0,carbsProgress:0, mealList: [mealDoc._id]})
        await dayDoc.save()
        dayCount += 1

      }else{
        currentDate.setDate(currentDate.getDate() + (dayCount-1))
        let currentDay = await Day.findOne({date:currentDate})
        currentDay.mealList.push(mealDoc._id)
        await currentDay.save()
      }

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
          {name: "fats", value: fats}]
        }

      let userDoc = new User(data)
      await userDoc.save()

      res.send({status:"success"})

    }catch(err){
      res.send({status:"failed", msg:"please try again"})
    }


  },

  getNutrientGoal: async function (req, res) {
    try {
      let data = await User.find({})
      if(data != null) {
        let calorie = {name: "Calorie", value: data[0].dailyCalorie}
        let nutrients = [calorie, ...data[0].macronutrients]
        res.send({status:"success",nutrients: nutrients, goal:data[0].goal})

      }else{
        res.send({status:"failed", msg:"there is no user"})
      }
    }catch(err){
      res.send({status:"failed", msg:"please try again"})
    }
  },


  getDailyNutrientProgress: async function(req,res){
    try{
      let data = await Meal.find({})
      let calories = 0
      let protein = 0

      if(data != null) {
        for(let meal in data){
          calories += meal.calories
          protein += meal.protein
        }
      }

      res.send({status:"success", calories:calories, protein:protein})


    }catch(err){
      res.send({status:"failed"})
    }


  },

  getDailyMealProgress: async function(req,res){
    try{
      let data = await Meal.find({})

      if(data != null) {
        res.send({status:"success", mealList: data})
      }

    }catch(err){
      res.send({status:"failed"})
    }
  }




}
