import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatabaseService} from './database.service';
import {ExternalAPIService} from './external-api.service';


class Meal {
  name: string;
  servingQty: number;
  servingUnit: string;
  servingWeightGram: number;
  protein: number;
  calories: number;
  fats: number;
  carbs: number;
  time: string;


  constructor(name:string="", servingQty: number=0,
              servingUnit: string="", servingWeightGram: number=0
              ,protein: number=0, calories: number=0, carbs:number=0,
              fats:number=0,time:string="")
  {
    this.name = name;
    this.servingQty = servingQty;
    this.servingUnit = servingUnit;
    this.servingWeightGram = servingWeightGram;
    this.time = time;
    this.protein = protein;
    this.calories = calories;
    this.fats = fats;
    this.carbs = carbs;

  }

}

class User{
  name:string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  activityLevel: string;

  constructor(name:string="", age: number=0, gender: string="", height: number=0,
              weight: number=0, activityLevel:string = "", goal: string="") {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.height = height;
    this.weight = weight;
    this.activityLevel = activityLevel;
    this.goal = goal;
  }


}

class Nutrient{

  name: string;
  value:number;
  max: number;

  constructor(name:string="",value:number=0, max:number=0){
    this.name = name;
    this.value = value;
    this.max = max;
    }

}



@Component({
  selector: 'app-root',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit {
  textInput = "";
  timeInput = "";
  user: User = new User();
  mealStatus = ""
  errorMessage = ""
  userExists = false
  goal = ""

  // Empty rather than seeded with placeholder rows, so the template can show a
  // proper empty state instead of a row of zeroes.
  inputMealList: Meal[] = [];
  historyList:any[] = []
  nutrientList:any[] = []
  suggestionList:any[] = []
  mealList: any[] = []
  breakfast:any[] = []
  lunch:any[] = []
  dinner:any[] = []

  proteinProgress = 0
  calorieProgress = 0


  constructor(private db: DatabaseService, private extapi: ExternalAPIService) {}

  ngOnInit(){
    this.getNutrientGoalAndProgress()
    this.getMealProgress()

  }

  sendMealInput(){
    let data = {text:this.textInput, time:this.timeInput};
    this.errorMessage = ""
    this.extapi.parseLanguage(data).subscribe({
      next: (dataList:any) => {
        if(dataList.status == "success") {
          this.inputMealList = []
          for (let data of dataList.meals) {
            this.inputMealList.push(new Meal(data.name, data.servingQty, data.servingUnit, data.servingWeightGram,
              data.protein, data.calories, data.carbs, data.fats, data.time))
          }
        }else{
          this.errorMessage = dataList.msg
        }
      },
      error: () => this.errorMessage = "Could not reach the server, please try again"
    })

   }

  addMeal(index:number){
    // time is required by the Meal schema; without this the save failed with a
    // generic error and no indication that a time was missing.
    if(!this.timeInput){
      this.errorMessage = "Pick a time before adding a suggested meal"
      return
    }

    this.errorMessage = ""
    this.inputMealList = []
    let data = this.suggestionList[index]
     this.inputMealList.push(new Meal(data.title, 1,"plate",0,
       parseInt(data.protein),parseInt(data.calories),parseInt(data.carbs), parseInt(data.fat),this.timeInput));
    this.confirmMeal()
   }

  confirmMeal(){
    this.errorMessage = ""
    this.db.addMeal(this.inputMealList).subscribe({
      next: (data:any) => {
        if(data.status == "success"){
          this.inputMealList = []
          this.timeInput = ""
          this.mealStatus = ""
          this.suggestionList = []
        }else{
          this.errorMessage = data.msg
        }

        this.getMealProgress()
        this.getNutrientGoalAndProgress()
      },
      error: () => this.errorMessage = "Could not reach the server, please try again"
    })
   }

  sendUserInfo(){
    this.errorMessage = ""
    this.db.addUserInfo(this.user).subscribe({
      next: (data:any) => {
        if(data.status === "success"){
          this.userExists = true
          this.getNutrientGoalAndProgress()
        }else{
          this.errorMessage = data.msg
        }
      },
      error: () => this.errorMessage = "Could not reach the server, please try again"
    })

   }

  getNutrientGoalAndProgress(){
     this.db.getNutrientGoalAndProgress().subscribe((data:any) => {

       if(data.status == "success") {
         this.userExists = true
         this.nutrientList = []
         for(let nutrient of data.nutrients){
           this.nutrientList.push(new Nutrient(nutrient.name,nutrient.value,nutrient.max));
         }
         this.goal = data.goal

       }else{
         this.userExists = false
       }

     })
   }

  getMealProgress(){
    this.db.getDailyMealProgress().subscribe((data:any) => {
      if(data.status == "success") {
        this.breakfast= data.breakfast
        this.lunch = data.lunch
        this.dinner = data.dinner
      }else{
        console.log("error")
      }
    })
  }

  nextDay(){
    this.db.nextDay().subscribe((data:any) => {
        if(data.status === "success"){
          this.suggestionList = []
          this.breakfast = []
          this.lunch = []
          this.dinner = []
          this.nutrientList.forEach(nutrient => {
            nutrient.value = 0
          })

          this.getMealHistory()
        }
    })
  }

  getMealHistory(){
    this.db.getMealHistory().subscribe((data:any) => {
      if(data.status == "success"){
        this.historyList = data.historyList
      }else{
        console.log("error")
      }
    })
  }

  suggestMeal(){
    this.errorMessage = ""
    this.extapi.suggestMeal().subscribe({
      next: (data:any) => {
        if(data.status == "success"){
          this.suggestionList = data.suggestionList
        }else{
          this.errorMessage = data.msg
        }
      },
      error: () => this.errorMessage = "Could not reach the server, please try again"
    })
  }

}

