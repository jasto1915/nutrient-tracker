import {Component, input} from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  imports: [RouterOutlet, FormsModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  textInput = "";
  timeInput = "";
  user: User = new User();
  mealStatus = ""
  userExists = false
  goal = ""

  inputMealList: Meal[] = [new Meal()];
  historyList:any[] = []
  nutrientList:any[] = []
  suggestionList:any[]=[{name: "None", calories:0,protein:0,carbs:0,fats:0}]
  mealList: any[] = [{name: "None", calories:"None",protein:"None"}]
  breakfast:any[] = [{name: "None", calories:"None",protein:"None"}]
  lunch:any[] = [{name: "None", calories:"None",protein:"None"}]
  dinner:any[] = [{name: "None", calories:"None",protein:"None"}]

  proteinProgress = 0
  calorieProgress = 0


  constructor(private db: DatabaseService, private extapi: ExternalAPIService) {}

  ngOnInit(){
    this.getNutrientGoalAndProgress()
    this.getMealProgress()

  }

  sendMealInput(){
    let data = {text:this.textInput, time:this.timeInput};
    this.extapi.parseLanguage(data).subscribe((dataList:any) => {
      if(dataList.status == "success") {
        this.inputMealList = []
        for (let data of dataList.meals) {
          this.inputMealList.push(new Meal(data.name, data.servingQty, data.servingUnit, data.servingWeightGram,
            data.protein, data.calories, data.carbs, data.fats, data.time))
        }
      }else{
        console.log(dataList.msg)
      }

    })

   }

  addMeal(index:number){
    this.inputMealList = []
    let data = this.suggestionList[index]
     this.inputMealList.push(new Meal(data.title, 1,"plate",0,
       parseInt(data.protein),parseInt(data.calories),parseInt(data.carbs), parseInt(data.fat),this.timeInput));
    this.confirmMeal()
   }

  confirmMeal(){
    this.db.addMeal(this.inputMealList).subscribe((data:any) => {
      this.mealStatus = data.status
      if(data.status == "success"){
        this.inputMealList = [new Meal()]
        this.timeInput = ""
        this.mealStatus = ""
        this.suggestionList = [{name: "None", calories:0,protein:0,carbs:0,fats:0}]

      }

      this.getMealProgress()
      this.getNutrientGoalAndProgress()

    })
   }

  sendUserInfo(){
    this.db.addUserInfo(this.user).subscribe((data:any) =>
    {
      if(data.status === "success"){
        this.userExists = true
        this.getNutrientGoalAndProgress()
      }

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
          this.suggestionList = [{name: "None", calories:0,protein:0,carbs:0,fats:0}]
          this.breakfast = [{name: "None", calories:"None",protein:"None"}]
          this.lunch = [{name: "None", calories:"None",protein:"None"}]
          this.dinner = [{name: "None", calories:"None",protein:"None"}]
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
    this.extapi.suggestMeal().subscribe((data:any) => {
        this.suggestionList = data.suggestionList
    })
  }

}

