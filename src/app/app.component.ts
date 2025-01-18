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

  constructor(private db: DatabaseService, private extapi: ExternalAPIService) {
  }

  sendInput(){
    let data = {text:this.textInput, time:this.timeInput};
    this.extapi.parseLanguage(data).subscribe((data:any) => {
      this.meal = new Meal(data.name, data.servingQty,data.servingUnit,data.servingWeightGram,
        data.protein,data.calories,data.time);

    })

   }

   confirmMeal(){
    this.db.addMeal(this.meal).subscribe((data:any) => {


    })
   }


}

