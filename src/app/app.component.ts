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
  time: string;


  constructor(name:string="", servingQty: number=0,
              servingUnit: string="", servingWeightGram: number=0
              ,protein: number=0, calories: number=0,time:string="")
  {
    this.name = name;
    this.servingQty = servingQty;
    this.servingUnit = servingUnit;
    this.servingWeightGram = servingWeightGram;
    this.time = time;
    this.protein = protein;
    this.calories = calories;

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


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  text = 'DeepNeuron-OnHit-Stage2';
  textInput = "";
  timeInput = "";
  meal: Meal = new Meal();
  user: User = new User();
  mealStatus = ""
  userStatus = ""
  userExists = false
  goal = ""
  nutrientList: any[] = [];

  constructor(private db: DatabaseService, private extapi: ExternalAPIService) {
  }

  ngOnInit(){
    this.db.getDailyNutrientGoal().subscribe((data:any) => {
      if(data.status == "success") {
        this.userExists = true
        this.goal = data.goal
        this.nutrientList = data.nutrients
      }else{
        this.userExists = false
      }
    })
  }

  sendMealInput(){
    let data = {text:this.textInput, time:this.timeInput};
    this.extapi.parseLanguage(data).subscribe((data:any) => {
      this.meal = new Meal(data.name, data.servingQty,data.servingUnit,data.servingWeightGram,
        data.protein,data.calories,data.time);

    })

   }

   confirmMeal(){
    this.db.addMeal(this.meal).subscribe((data:any) => {
      this.mealStatus = data.status

    })

   }

   sendUserInfo(){
    this.db.addUserInfo(this.user).subscribe((data:any) =>
    {
      this.userStatus = data.status
    })

     this.db.getDailyNutrientGoal().subscribe((data:any) => {

       if(data.status == "success") {
         this.userExists = true
         this.nutrientList = data.nutrients
         this.goal = data.goal
       }else{
         this.userExists = false
       }

     })



   }


}

